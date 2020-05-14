import React, {Component} from 'react';
import {Icon} from "antd";
import './PollList.css';
import Table from "antd/lib/table";
import Column from "antd/lib/table/Column";
import RadioGroup from "antd/lib/radio/group";
import Radio from "antd/lib/radio";
import { withRouter} from 'react-router-dom';
import PollList from "./PollList";

class PollsTable extends Component {
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
            isLoading: false
        };
        this.loadPollList = this.loadPollList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }


    /*isSelected = (choice) => {
        return this.props.poll.selectedChoice === choice.id;
    };

    getWinningChoice = () => {
        return this.props.poll.choices.reduce((prevChoice, currentChoice) =>
                currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice,
            {voteCount: -Infinity}
        );
    };*/


    render() {
        let choiceVoteCount;
        let winningChoice;
        let currentchoices = [];
        let pollId;
        return (
            <Table dataSource={this.props.polls}>
                <Column dataIndex="id"
                    render={(id) => {
                        pollId = id;
                    }}
                />
                <Column title="Username"
                        dataIndex="createdBy"
                        key="createdBy"
                        render={(createdBy) => (
                            <span>{createdBy.name}</span>
                        )}
                />
                <Column title="Date" dataIndex="creationDateTime" key="creationDateTime"/>
                <Column title="Question" dataIndex="question" key="question"/>
                <Column title="Choices"
                        dataIndex="choices"
                        key="choices"
                        render={(choices) => (
                            <span>
                                <RadioGroup
                                    onChange={this.props.handleVoteChange}>
                                    {choices.map(choice => {
                                        return (
                                            <span>
                                                <Radio value={this.props.currentVote(pollId)}>{choice.text}</Radio>
                                        </span>
                                        )
                                    })}
                                </RadioGroup>
                            </span>
                        )}
                />
                <Column title="Statistics"
                        dataIndex="totalVotes"
                        key="totalVotes"
                        render={(totalVotes) => (
                            <span>
                            </span>
                        )}
                />
                <Column title="Action"
                        key="action"
                        render={() => (
                            <span>
                                <a href="#">Vote</a>
                            </span>
                        )}
                />
            </Table>
        );
    }
}

function CompletedOrVotedPollChoice(props) {
    return (
        <div className="cv-poll-choice">
            <span className="cv-poll-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(props.percentVote * 100) / 100}%
                </span>
                <span className="cv-choice-text">
                    {props.choice.text}
                </span>
                {
                    props.isSelected ? (
                        <Icon
                            className="selected-choice-icon"
                            type="check-circle-o"
                        />) : null
                }
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner' : 'cv-choice-percent-chart'}
                  style={{width: props.percentVote + '%'}}>
            </span>
        </div>
    );
}

//export default PollsTable;
export default withRouter(PollsTable);