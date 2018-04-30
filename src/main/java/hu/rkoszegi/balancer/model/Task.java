package hu.rkoszegi.balancer.model;


import lombok.Data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
public class Task {

    private String name;

    private Date plannedDate;

    private Date completionDate;

    private Boolean completed;

    private String description;

    private String priority;

    private Set<Task> subTasks = new HashSet<>();
}
