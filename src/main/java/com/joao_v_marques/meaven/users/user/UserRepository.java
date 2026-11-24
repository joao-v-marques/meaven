package com.joao_v_marques.meaven.users.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Used by the login (CustomUserDetailsService); fetches the role to build the authority
    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    // Sign-up blocks "Maria" when "maria" exists, so two accounts never look the same
    boolean existsByUsernameIgnoreCase(String username);

    // Same check when someone renames their own account: their current username does not count
    boolean existsByUsernameIgnoreCaseAndIdNot(String username, Integer id);
}
