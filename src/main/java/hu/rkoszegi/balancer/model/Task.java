package hu.rkoszegi.balancer.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Document
public class Task {

    @Id
    private String id;

    private String name;

    private Date plannedDate;

    private Date completionDate;

    private Boolean completed;

    private String description;

    private String priority;

    @DBRef
    private Set<Task> subTasks = new HashSet<>();
}
