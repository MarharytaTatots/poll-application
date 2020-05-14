import React, {Component} from 'react';
import {getAllPolls, getUserCreatedPolls, getUserVotedPolls} from "../util/APIUtils";
import Poll from './Poll';
import {castVote} from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import {Button, DatePicker, Icon, notification} from "antd";
import {POLL_LIST_SIZE} from "../constants";
import { withRouter} from 'react-router-dom';
import PollsTable from '../poll/PollsTable';
import './PollList.css';
import RangePicker from "antd/lib/date-picker/RangePicker";
import Input from "antd/lib/input";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form";

class PollList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false,
            startDate: new Date(),
            valuePollText: "",
            valueByUsername: ""
        };
        this.loadPollList = this.loadPollList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePollTextChange = this.handlePollTextChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }



    loadPollList(page = 0, size = POLL_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(this.props.username, page, size);
            }
        } else {
            promise = getAllPolls(page, size);
        }
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });


        promise
            .then(response => {
                const polls = this.state.polls.slice();
                const currentVotes = this.state.currentVotes.slice();

                this.setState({
                    polls: polls.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false,
                    startDate: new Date(),
                    valuePollText: "",
                    valueByUsername: ""
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidMount() {
        this.loadPollList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false,
                startDate: new Date(),
                valuePollText: "",
                valueByUsername: ""
            });
            this.loadPollList();
        }
    }



    handleLoadMore() {
        this.loadPollList(this.state.page + 1);
    }



    handleVoteChange(event, pollIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;
        this.setState({
            currentVotes: currentVotes
        });
    }

    handleInputChange(event){
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : inputValue
        });
    }

    handleDateChange(event){
        this.setState({
            startDate:event.target.value
        });
    }

    handlePollTextChange(event){
        this.setState({
            valuePollText: event.target.value
        });
    }

    handleUsernameChange(event){
        this.setState({
            valueByUsername: event.target.value
        });
    }

   /* handleClick(event){
        event.preventDefault();
        const filterRequest={
            date: "",
            textPoll: this.state.valuePollText,
            username: this.state.valueByUsername
        };
        filter(filterRequest)
            .then(response => {
                this.props.history.push("/filter");
            }).catch(error => {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }*/


    handleVoteSubmit(event, pollIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Polling App',
                description: "Please login to vote.",
            });
            return;
        }
        const poll = this.state.polls[pollIndex];
        const selectedChoice = this.state.currentVotes[pollIndex];
        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };



        castVote(voteData)
            .then(response => {
                const polls = this.state.polls.slice();
                polls[pollIndex] = response;
                this.setState({
                    polls: polls
                });
            }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    render() {

        const pollViews = [];
            this.state.polls.forEach((poll, pollIndex) => {
                pollViews.push(<Poll
                    key={poll.id}
                    poll={poll}
                    currentVote={this.state.currentVotes[pollIndex]}
                    handleVoteChange={(event) => this.handleVoteChange(event, pollIndex)}
                    handleVoteSubmit={(event) => this.handleVoteSubmit(event, pollIndex)}/>)
            });

            return (
                <div className="polls-container">
                    <Form className="polls-filter" layout="inline" /*onSubmit={this.handleSubmit}*/>
                    </Form>
                    {pollViews}
                    {
                        !this.state.isLoading && this.state.polls.length === 0 ? (
                            <div className="no-polls-found">
                                <span>No Polls Found.</span>
                            </div>
                        ) : null
                    }
                    {
                        !this.state.isLoading && !this.state.last ? (
                            <div className="load-more-polls">
                                <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                    <Icon type="plus"/> Load more
                                </Button>
                            </div>) : null
                    }
                    {
                        this.state.isLoading ?
                            <LoadingIndicator/> : null
                    }
                </div>
            );
    }
}

export default withRouter(PollList);