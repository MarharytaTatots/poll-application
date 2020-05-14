package com.example.polls.repository;

import com.example.polls.model.Poll;
import com.example.polls.payload.FilterRequest;
import com.example.polls.payload.PollResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

    Optional<Poll> findById(Long pollId);

    Page<Poll> findByCreatedBy(Long userId, Pageable pageable);

    long countByCreatedBy(Long userId);

    List<Poll> findByIdIn(List<Long> pollIds);

    List<Poll> findByIdIn(List<Long> pollIds, Sort sort);

/*    @Query("SELECT p FROM Poll p where p.question = :polltext")
    Page<Poll> filterByPollText(@Param("polltext") String polltext, Pageable pageable);

    @Query("SELECT p FROM Poll p where p.createdAt = :date")
    Page<Poll> filterByDate(@Param("date") Instant date, Pageable pageable);

    @Query("SELECT p FROM Poll p INNER JOIN User AS u ON u.id = p.createdBy WHERE u.username=username")
    Page<Poll> filter(@Param("username") String username, Pageable pageable);*/
}
