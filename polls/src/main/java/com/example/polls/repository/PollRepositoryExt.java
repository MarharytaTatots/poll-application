package com.example.polls.repository;

import com.example.polls.model.Poll;
import com.example.polls.payload.FilterRequest;
import com.example.polls.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PollRepositoryExt {
    Page<Poll> filter(UserPrincipal currentUser, FilterRequest filterRequest, Pageable pageable);
}
