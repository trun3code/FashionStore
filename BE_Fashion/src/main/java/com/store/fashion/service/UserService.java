package com.store.fashion.service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.store.fashion.model.Account;
import com.store.fashion.model.Address;
import com.store.fashion.model.User;
import com.store.fashion.repository.AccountRepository;
import com.store.fashion.repository.AddressRepository;
import com.store.fashion.repository.UserRepository;
// import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AddressRepository addressRepository;
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    public User login(String email, String password) {
        // String encodePassword = passwordEncoder.encode(password);
        Account account = accountRepository.findByEmailAndPassword(email, password);
        User user = userRepository.findById(account.getUserId()).get();
        return user;
    }

    public User register(Account account, User user) {
        if (accountRepository.existsByEmail(account.getEmail()))
            return null;
        User newUser = createProfile(user);
        account.setUserId(newUser.getId());
        account.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        accountRepository.save(account);
        return newUser;
    }

    public User getUser(int userId) {
        var rs = userRepository.findById(userId);
        return rs.isEmpty() ? null : rs.get();
    }

    public User getUserFullInfo(int userId) {
        var rs = userRepository.findById(userId);
        if (rs.isEmpty())
            return null;
        User user = rs.get();
        Account acc = accountRepository.findByUserId(user.getId());
        if (acc == null)
            return null;
        user.setEmail(acc.getEmail());
        return user;
    }

    public boolean removeUser(int userId) {
        if (!userRepository.existsById(userId))
            return false;
        userRepository.deleteById(userId);
        return true;
    }

    public User createProfile(User user) {
        user.setRole("user");
        user.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        return userRepository.saveAndFlush(user);
    }

    public User updateProfile(User user) {
        var temp = userRepository.findById(user.getId());
        if (temp.isEmpty())
            return null;
        User curUser = temp.get();
        curUser.setName(user.getName());
        curUser.setPhoneNumber(user.getPhoneNumber());
        curUser.setGender(user.getGender());
        if (user.getAvatar() != null)
            curUser.setAvatar(user.getAvatar());
        curUser.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        return userRepository.save(curUser);
    }

    public List<User> getFullUser() {
        var rs = userRepository.findAllUsers();
        for (User user : rs) {
            Account acc = accountRepository.findByUserId(user.getId());
            if (acc != null)
                user.setEmail(acc.getEmail());
        }
        return rs;
    }

    public boolean availableEmail(String email) {
        return !accountRepository.existsByEmail(email);
    }

    public boolean changePassword(int userId, String oldPass, String newPass) {
        if (!accountRepository.existsByUserIdAndPassword(userId, oldPass))
            return false;
        Account account = accountRepository.findByUserId(userId);
        if (account == null)
            return false;
        account.setPassword(newPass);
        accountRepository.save(account);
        return true;
    }

    public Address updateAddress(Address address, int userId) {
        if (!addressRepository.existsById(address.getId()))
            return null;
        address = addressRepository.save(address);
        var temp = userRepository.findById(userId);
        if (temp.isEmpty())
            return null;
        User curUser = temp.get();
        curUser.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        userRepository.save(curUser);
        return address;
    }

    public Address createAddress(Address address, int userId) {
        try {
            address.setId(0);
            address = addressRepository.save(address);
            var temp = userRepository.findById(userId);
            if (temp.isEmpty())
                return null;
            User curUser = temp.get();
            curUser.setAddress(address);
            curUser.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            userRepository.save(curUser);
            return address;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}