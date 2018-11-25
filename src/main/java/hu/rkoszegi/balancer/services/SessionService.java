package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;

public interface SessionService {
    User getLoggedInUser();
}
