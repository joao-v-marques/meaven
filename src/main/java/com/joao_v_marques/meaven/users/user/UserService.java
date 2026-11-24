package com.joao_v_marques.meaven.users.user;

import com.joao_v_marques.meaven.shared.exceptions.BusinessException;
import com.joao_v_marques.meaven.shared.exceptions.NotFoundException;
import com.joao_v_marques.meaven.users.auth.dto.ChangePasswordRequest;
import com.joao_v_marques.meaven.users.auth.dto.RegisterRequest;
import com.joao_v_marques.meaven.users.role.Role;
import com.joao_v_marques.meaven.users.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    // Role created by V2__insert_user_role.sql
    public static final String SELF_REGISTERED_ROLE = "USER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Someone creates their own account on /register; it always gets the USER role
    @Transactional
    public User register(RegisterRequest request) {
        String username = request.username().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new BusinessException("Esse usuário já está em uso. Escolha outro.");
        }

        Role role = roleRepository.findByName(SELF_REGISTERED_ROLE)
                .orElseThrow(() -> new IllegalStateException("Role " + SELF_REGISTERED_ROLE + " is missing from the roles table"));

        User user = new User();
        user.setName(request.name().trim());
        user.setUsername(username);
        user.setBirthDate(request.birthDate());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);

        return userRepository.save(user);
    }

    // The logged-in user changes their own password (requires the current one)
    @Transactional
    public void changeOwnPassword(Integer userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Não foi encontrado nenhum usuário com o ID fornecido."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("A senha atual está incorreta.");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException("A nova senha deve ser diferente da senha atual.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    }
}
