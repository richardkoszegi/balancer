package hu.rkoszegi.balancer.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Objects;

@Data
@Document
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

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
