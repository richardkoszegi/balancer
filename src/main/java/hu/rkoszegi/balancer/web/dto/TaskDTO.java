package hu.rkoszegi.balancer.web.dto;

import hu.rkoszegi.balancer.model.Priority;
import lombok.Data;

import java.util.Date;

@Data
public class TaskDTO {

    private String id;

    private String name;

    private Date plannedDate;

    private Date completionDate;

    private boolean completed;

    private String description;

    private Priority priority;

    private boolean assignedToDate;

    private int estimatedTime;

    private String assignedUser;
}
