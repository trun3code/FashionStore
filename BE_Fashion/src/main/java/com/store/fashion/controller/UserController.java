package com.store.fashion.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.fashion.dto.AccountDto;
import com.store.fashion.dto.AddressDto;
import com.store.fashion.dto.UserDto;
import com.store.fashion.model.Account;
import com.store.fashion.model.Address;
import com.store.fashion.model.User;
import com.store.fashion.service.ImageService.ImageType;
import com.store.fashion.service.ImageService;
import com.store.fashion.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin
@Tag(name = "User API")
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ImageService imageService;

    @Operation(summary = "Toàn bộ user", description = "Trả về toàn bộ user cùng thông tin chi tiết")
    @GetMapping("/full")
    public List<User> getFullUsers() {
        return userService.getFullUser();
    }

    @Operation(summary = "Tìm kiếm email hoặc tên của người dùng", description = "Trả về danh sách người dùng có liên quan đến từ khóa")
    @GetMapping("/search/{str}")
    public List<User> getSearchUsers(
            @Parameter(description = "Từ khóa", example = "Abc") @PathVariable(value = "str") String keyword) {
        keyword = keyword.trim().toLowerCase();
        var users = userService.getFullUser();
        if (keyword == null || keyword.equals(""))
            return users;
        ArrayList<User> rs = new ArrayList<>();
        for (User user : users) {
            if (user.getEmail().toLowerCase().contains(keyword) || user.getName().toLowerCase().contains(keyword))
                rs.add(user);
        }
        return rs;
    }

    @Operation(summary = "Lấy thông tin người dùng ", description = "Trả về user")
    @GetMapping("/{id}")
    public UserDto User(
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "id") int userId) {
        return new UserDto(userService.getUser(userId));
    }

    @Operation(summary = "Lấy thông tin chi tiết của người dùng ", description = "Trả về user cùng thông tin chi tiết")
    @GetMapping("/{id}/full")
    public ResponseEntity<User> getUserFullInfo(
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "id") int userId) {
        var user = userService.getUserFullInfo(userId);
        return user != null
                ? ResponseEntity.ok().body(user)
                : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Xóa người dùng", description = "Xóa người dùng khỏi hệ thống")
    @DeleteMapping("/delete/{id}")
    public void removeUser(
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "id") int userId) {
        userService.removeUser(userId);
    }

    @Operation(summary = "Admin đăng nhập", description = "Đăng nhập tài khoản admin vào hệ thống")
    @PostMapping("/admin/login")
    public ResponseEntity<UserDto> adminLogin(@RequestBody AccountDto accountDto) {
        try {
            String email = accountDto.getEmail().trim();
            String password = accountDto.getPassword().trim();
            if (email.equals("") || email == null || password.equals("") || password == null)
                return null;
            var user = userService.login(email, password);
            return user == null || !user.getRole().equals("admin")
                    ? ResponseEntity.notFound().build()
                    : ResponseEntity.ok().body(new UserDto(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Đăng nhập", description = "Đăng nhập vào hệ thống")
    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody AccountDto accountDto) {
        try {
            String email = accountDto.getEmail().trim();
            String password = accountDto.getPassword().trim();
            if (email.equals("") || email == null || password.equals("") || password == null)
                return null;
            var user = userService.login(email, password);
            return user == null
                    ? ResponseEntity.notFound().build()
                    : ResponseEntity.ok().body(new UserDto(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Đăng ký", description = "Đăng ký tài khoản")
    @PostMapping("/signup")
    public ResponseEntity<UserDto> register(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String userJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        var userTree = mapper.readTree(userJson);
        AccountDto accountDto = mapper.convertValue(userTree.get("account"), AccountDto.class);
        UserDto userDto = mapper.convertValue(userTree.get("user"), UserDto.class);
        boolean isSuccess = false;
        if (isValidAccount(accountDto)) {
            String imgPath = imageService.addImage(image, userDto.getName(), ImageType.USER);
            userDto.setAvatar(imgPath);
            userDto = new UserDto(userService.register(new Account(accountDto), new User(userDto)));
            isSuccess = userDto != null;
        }
        return isSuccess ? ResponseEntity.ok(userDto) : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Kiểm tra tính hợp lệ của email", description = "Kiểm tra xem email được dùng hay chưa")
    @PostMapping("/valid-email")
    public ResponseEntity<Object> checkValidEmail(@RequestPart(value = "data") String email) {
        return userService.availableEmail(email)
                ? ResponseEntity.ok().build()
                : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Đổi mật khẩu", description = "Đổi mật khẩu tài khoản")
    @PutMapping("/{id}/change-password")
    public ResponseEntity<Object> changePassword(
            @PathVariable(value = "id") int userId,
            @RequestPart(value = "old") String oldPass,
            @RequestPart(value = "new") String newPass) {
        if (newPass.equals("") || newPass == null)
            return ResponseEntity.noContent().build();
        return userService.changePassword(userId, oldPass, newPass)
                ? ResponseEntity.ok().build()
                : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Cập nhật thông tin của người dùng ", description = "Cập nhật thông tin của người dùng ")
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String userJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User user = objectMapper.readValue(userJson, User.class);
        String oldImgPath = user.getAvatar();
        String imgPath = imageService.addImage(image, user.getName(), ImageType.USER);
        user.setAvatar(imgPath);
        var newUser = userService.updateProfile(user);
        if (newUser == null) {
            imageService.removeImage(imgPath, ImageType.USER);
            return ResponseEntity.badRequest().build();
        }
        imageService.removeImage(oldImgPath, ImageType.USER);
        return ResponseEntity.ok().body(newUser);
    }

    @Operation(summary = "Lấy địa chỉ của người dùng ", description = "Địa chỉ của người dùng ")
    @PutMapping("/{id}/address/update")
    public ResponseEntity<Address> getAddress(@RequestBody AddressDto address,
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "id") int userId) {
        Address newAddress = address.getId() == null
                ? userService.createAddress(new Address(address), userId)
                : userService.updateAddress(new Address(address), userId);
        return newAddress != null ? ResponseEntity.ok().body(newAddress) : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Lấy hình ảnh của người dùng ", description = "Hình ảnh của người dùng ")
    @GetMapping("/image/{imageName}")
    public ResponseEntity<Object> getImage(
            @Parameter(description = "Tên file ảnh", example = "abc.png") @PathVariable String imageName) {
        Object image = imageService.getImage(imageName, ImageType.USER);
        return image == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("image/" + imageName.split("\\.")[1]))
                        .body(image);
    }

    public boolean isValidAccount(AccountDto accountDto) {
        String email = accountDto.getEmail();
        String password = accountDto.getPassword();
        if (email.equals("") || email == null || !userService.availableEmail(email) || password.equals("")
                || password == null)
            return false;
        return true;
    }
}