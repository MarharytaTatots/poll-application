package com.example.polls.repository.impl;

import com.example.polls.model.Poll;
import com.example.polls.model.User;
import com.example.polls.payload.FilterRequest;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.PollRepositoryExt;
import com.example.polls.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PollRepositoryImpl implements PollRepositoryExt {

    @Autowired
    private EntityManager entityManager;

    @Override
    public Page<Poll> filter(UserPrincipal currentUser, FilterRequest filterRequest, Pageable pageable) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Poll> cQuery = builder.createQuery(Poll.class);
        Root<Poll> root = cQuery.from(Poll.class);
        cQuery.select(root);

        List<Predicate> predicates = new ArrayList<>();


        if(!StringUtils.isEmpty(filterRequest.getUsername())){
            predicates.add(builder.like(root.get("user").get("username"), "%" + filterRequest.getUsername().toLowerCase() + "%"));
        }

        if(!StringUtils.isEmpty(filterRequest.getQuestion())){
            predicates.add(builder.like(builder.lower(root.get("question")), "%" + filterRequest.getQuestion().toLowerCase() + "%"));
        }

        if(!StringUtils.isEmpty(filterRequest.getStartDate())){
             predicates.add(builder.greaterThanOrEqualTo(root.get("createdAt"),  filterRequest.getStartDate()));
        }

        if(!StringUtils.isEmpty(filterRequest.getEndDate())){
            predicates.add(builder.lessThanOrEqualTo(root.get("createdAt"),  filterRequest.getEndDate()));
        }

        Predicate[] predArray = new Predicate[predicates.size()];
        predicates.toArray(predArray);

        cQuery.where(predArray);
        TypedQuery<Poll> query = entityManager.createQuery(cQuery);
        List<Poll> pollList = query.getResultList();
        return new PageImpl<>(pollList, pageable, pollList.size());
    }
}
