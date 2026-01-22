package de.jexcellence.lmbeauty.exception;

public class CancellationDeadlinePassedException extends RuntimeException {
    public CancellationDeadlinePassedException(String message) {
        super(message);
    }
}
