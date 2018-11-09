package hu.rkoszegi.balancer.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private String id;

    private String name;

    private Date deadline;

    private String description;

    private String ownerName;

    private List<String> memberNames = new ArrayList<>();

    private Set<TaskDTO> tasks = new HashSet<>();
}
