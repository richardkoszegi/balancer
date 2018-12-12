package hu.rkoszegi.balancer.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class Task {

    @Id
    private String id;

    private String name;

    private Date plannedDate;

    private Date completionDate;

    private boolean completed;

    private String description;

    private Priority priority;

    private boolean assignedToDate;

    private int estimatedTime;

    @DBRef
    private User assignedUser;

    @DBRef
    private Project project;

    @Override
    public String toString() {
        return "Task{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", plannedDate=" + plannedDate +
                ", completionDate=" + completionDate +
                ", completed=" + completed +
                ", description='" + description + '\'' +
                ", priority=" + priority +
                ", assignedToDate=" + assignedToDate +
                ", estimatedTime=" + estimatedTime +
                ", assignedUser=" + assignedUser.getUsername() +
                ", project=" + project.getId() +
                '}';
    }
}
