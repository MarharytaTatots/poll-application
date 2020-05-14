package com.example.polls.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.Date;

public class
FilterRequest {

    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Instant startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Instant endDate;

    private String question;

    private String username;


    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
