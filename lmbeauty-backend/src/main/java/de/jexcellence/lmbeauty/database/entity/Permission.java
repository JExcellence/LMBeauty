package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.lmbeauty.type.EPermission;
import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "permissions")
@Data
@EqualsAndHashCode(callSuper = true)
public class Permission extends AbstractEntity {

    @Column(name = "name", unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private EPermission name;

    @Column(name = "description")
    private String description;
}
