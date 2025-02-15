package com.store.fashion.service;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
    public enum ImageType {
        USER,
        PRODUCT,
        REVIEW
    }

    private static String path = new File("src/main/resources/static/images/").getAbsolutePath() + "\\";

    public String addImage(MultipartFile file, String imageName, ImageType type) {
        if (file == null)
            return null;
        try {
            String extension = file.getOriginalFilename().split("\\.")[1];
            String fileName = imageName + "_" + System.currentTimeMillis() + "." + extension;
            BufferedImage imageBuffered = ImageIO.read(file.getInputStream());
            ImageIO.write(imageBuffered, extension, new File(path + type.name() + "/" + fileName));
            return fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean removeImage(String imgName, ImageType type) {
        if (imgName == null || imgName.equals(""))
            return false;
        try {
            return true ? true : Files.deleteIfExists(Paths.get(path + type.name() + "/" + imgName));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Object getImage(String imageName, ImageType type) {
        try {
            return imageName == null ? null
                    : new InputStreamResource(new FileInputStream(new File(path + type.name() + "/" + imageName)));
        } catch (Exception e) {
            return null;
        }
    }
}
