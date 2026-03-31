package com.demo.project.repository;

import com.demo.project.entity.Address;
import com.demo.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
    List<Address> findByUserUserId(Long userId);
}
