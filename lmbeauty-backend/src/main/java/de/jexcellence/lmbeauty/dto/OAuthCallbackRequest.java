package de.jexcellence.lmbeauty.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthCallbackRequest {
    @NotBlank(message = "Authorization code is required")
    private String code;
    
    private String state;
}