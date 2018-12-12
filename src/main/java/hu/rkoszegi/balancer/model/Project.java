package hu.rkoszegi.balancer.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Data
@Document
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class Project {

    @Id
    private String id;

    private String name;

    private Date deadline;

    private String description;

    @DBRef
    private User owner;

    @DBRef
    private List<User> members = new ArrayList<>();

    @DBRef
    private Set<Task> tasks = new HashSet<>();
}
