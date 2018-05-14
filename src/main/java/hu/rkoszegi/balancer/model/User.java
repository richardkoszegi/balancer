package hu.rkoszegi.balancer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@Document
public class User {

    @Id
    private String id;

    private String username;

    private String email;

    private String password;

    @DBRef
    private Set<Project> projects = new HashSet<>();
}
