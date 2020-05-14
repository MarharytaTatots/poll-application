package com.example.polls.model.audit;


import com.example.polls.model.audit.DateAudit;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@JsonIgnoreProperties(
        value = {"createdBy", "updatedBy"},
        allowGetters = true
)
public abstract class UserDateAudit extends DateAudit {

    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedBy
    private Long updatedBy;

    public Long getCreateBy(){
        return createdBy;
    }

    public void setCreateBy(Long createBy){
        this.createdBy = createBy;
    }

    public Long getUpdateBy(){
        return updatedBy;
    }

    public void setUpdateBy(Long updateBy){
        this.updatedBy = updateBy;
    }

}
