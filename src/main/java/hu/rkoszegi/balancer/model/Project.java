package hu.rkoszegi.balancer.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Document
public class Project {

    @Id
    private String id;

    private Date deadline;

    private String description;

    private Set<Task> tasks = new HashSet<>();
}
