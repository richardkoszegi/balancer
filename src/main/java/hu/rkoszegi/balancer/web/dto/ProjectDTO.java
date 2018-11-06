package hu.rkoszegi.balancer.web.dto;

import hu.rkoszegi.balancer.model.Task;
import lombok.Data;

import java.util.*;

@Data
public class ProjectDTO {

    private String id;

    private String name;

    private Date deadline;

    private String description;

    private String ownerName;

    private List<String> memberNames = new ArrayList<>();

    private Set<Task> tasks = new HashSet<>();
}
