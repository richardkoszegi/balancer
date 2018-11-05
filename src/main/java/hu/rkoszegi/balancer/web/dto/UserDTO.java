package hu.rkoszegi.balancer.web.dto;

import hu.rkoszegi.balancer.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {

    private String username;

    private UserRole role;
}
