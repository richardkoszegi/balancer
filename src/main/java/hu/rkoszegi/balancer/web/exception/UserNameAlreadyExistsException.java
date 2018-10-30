package hu.rkoszegi.balancer.web.exception;


public class UserNameAlreadyExistsException extends Exception {
    public UserNameAlreadyExistsException(String message) {
        super(message);
    }
}
