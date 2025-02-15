package com.store.fashion.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.fashion.dto.ProductDto;
import com.store.fashion.dto.SimpleProductData;
import com.store.fashion.dto.SimpleReviewData;
import com.store.fashion.dto.ReviewDto;
import com.store.fashion.model.Product;
import com.store.fashion.model.ProductItem;
import com.store.fashion.model.Review;
import com.store.fashion.service.ImageService;
import com.store.fashion.service.ProductService;
import com.store.fashion.service.ImageService.ImageType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/product")
@CrossOrigin()
@Tag(name = "Products API")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private ImageService imageService;
    @Autowired
    private RestTemplate restTemplate;

    @Operation(summary = "Toàn bộ sản phẩm", description = "Trả về toàn bộ sản phẩm ")
    @GetMapping("")
    public List<ProductDto> getAllProducts() {
        return convertToProductDtoList(productService.getAllProduct());
    }

    @Operation(summary = "Lấy danh sách thông tin đơn giản của sản phẩm", description = "Trả về danh sách sản phẩm đơn giản")
    @GetMapping("/simple")
    public List<SimpleProductData> getSimpleProducts() {
        return convertToSimpleProductDataList(productService.getAllProduct());
    }

    @Operation(summary = "Lấy toàn bộ danh sách thông tin đơn giản review ", description = "Trả về danh sách toàn bộ review đơn giản")
    @GetMapping("/review/simple")
    public List<SimpleReviewData> getSimpleReviews() {
        return convertToSimpleReviewDataList(productService.getAllReview());
    }

    @Operation(summary = "Toàn bộ sản phẩm cùng các thông tin chi tiết", description = "Trả về toàn bộ sản phẩm cùng thông tin chi tiết")
    @GetMapping("/full")
    public List<ProductDto> getFullProducts() {
        return convertToProductDtoList(productService.getFullProduct());
    }

    @Operation(summary = "Top 4 sản phẩm bán chạy", description = "Trả về 4 sản phẩm bán chạy ")
    @GetMapping("/hot")
    public List<ProductDto> getHotProductDtos() {
        return convertToProductDtoList(productService.getHotProducts());
    }

    @Operation(summary = "Lọc sản phẩm", description = "Danh sách sản phẩm theo bộ lọc")
    @GetMapping("/filter")
    public List<ProductDto> getFilterProductDtos(@RequestParam(required = false) Map<String, String> reqParam) {
        return reqParam.size() > 0
                ? convertToProductDtoList(productService.getProductsFilter(reqParam))
                : convertToProductDtoList(productService.getFullProduct());
    }

    @Operation(summary = "Tìm kiếm sản phẩm theo tên", description = "Trả về danh sách sản phẩm có liên quan đến từ khóa")
    @GetMapping("/search/{str}")
    public List<ProductDto> getSearchProductDtos(
            @Parameter(description = "Từ khóa", example = "Giày") @PathVariable(value = "str") String keyword,
            @RequestParam(required = false) Map<String, String> reqParam) {
        keyword = keyword.trim().toLowerCase();
        var products = convertToProductDtoList(
                reqParam.size() > 0
                        ? productService.getProductsFilter(reqParam)
                        : productService.getFullProduct());
        if (keyword == null || keyword.equals(""))
            return products;
        ArrayList<ProductDto> rs = new ArrayList<>();
        for (ProductDto product : products)
            if (product.getProductName().toLowerCase().contains(keyword))
                rs.add(product);
        return rs;
    }

    @Operation(summary = "Lấy sản phẩm theo id", description = "Trả về sản phẩm có id tương ứng")
    @GetMapping(path = "/{id}")
    public ProductDto getProduct(
            @Parameter(description = "id của sản phẩm", example = "1") @PathVariable(value = "id") int productId) {
        var product = productService.getProduct(productId);
        if (product == null)
            return null;
        ProductDto productDto = new ProductDto(product);
        productDto.setItems(productService.getProductItems(productId));
        return productDto;
    }

    @Operation(summary = "Thêm mới sản phẩm", description = "Tạo sản phẩm mới")
    @PostMapping("/new")
    public ProductDto createProduct(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String productDtoJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductDto productDto = objectMapper.readValue(productDtoJson, ProductDto.class);
        String imgPath = imageService.addImage(image, productDto.getProductName(), ImageType.PRODUCT);
        productDto.setProductImage(imgPath);
        return new ProductDto(productService.createProduct(new Product(productDto)));
    }

    @Operation(summary = "Cập nhật sản phẩm", description = "Cập nhật thông tin của sản phẩm")
    @PutMapping("/update")
    public ProductDto updateProduct(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String productDtoJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductDto productDto = objectMapper.readValue(productDtoJson, ProductDto.class);
        String oldImgPath = productDto.getProductImage();
        String imgPath = imageService.addImage(image, productDto.getProductName(), ImageType.PRODUCT);
        productDto.setProductImage(imgPath);
        var newProduct = productService.updateProduct(new Product(productDto));
        if (newProduct != null)
            imageService.removeImage(oldImgPath, ImageType.PRODUCT);
        else
            imageService.removeImage(imgPath, ImageType.PRODUCT);
        return new ProductDto(newProduct);
    }

    @Operation(summary = "Xóa sản phẩm theo id", description = "Xóa sản phẩm có id tương ứng")
    @DeleteMapping("/delete/{id}")
    public void removeProduct(
            @Parameter(description = "id của sản phẩm", example = "1") @PathVariable(value = "id") int productId) {
        String oldImgPath = productService.getProduct(productId).getProductImage();
        if (productService.removeProduct(productId))
            imageService.removeImage(oldImgPath, ImageType.PRODUCT);
    }

    @Operation(summary = "Thêm mới item của sản phẩm", description = "Tạo item mới của sản phẩm")
    @PostMapping("/{productId}/item/new")
    public ProductItem createProductItem(
            @PathVariable int productId,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String productItemJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductItem productItem = objectMapper.readValue(productItemJson, ProductItem.class);
        String imgPath = imageService.addImage(image, "item", ImageType.PRODUCT);
        productItem.setProductImage(imgPath);
        return productService.createProductItem(productItem, productId);
    }

    @Operation(summary = "Cập nhật item của sản phẩm", description = "Cập nhật item của sản phẩm")
    @PutMapping("/{productId}/item/update")
    public ProductItem updateProductItem(
            @PathVariable int productId,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "data") String productItemJson) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductItem productItem = objectMapper.readValue(productItemJson, ProductItem.class);
        String oldImgPath = productItem.getProductImage();
        String imgPath = imageService.addImage(image, "item", ImageType.PRODUCT);
        productItem.setProductImage(imgPath);
        var newProductItem = productService.updateProductItem(productItem, productId);
        if (newProductItem != null)
            imageService.removeImage(oldImgPath, ImageType.PRODUCT);
        else
            imageService.removeImage(imgPath, ImageType.PRODUCT);
        return newProductItem;
    }

    @Operation(summary = "Xóa item của sản phẩm theo id", description = "Xóa item có id tương ứng của sản phẩm")
    @DeleteMapping("/item/delete/{id}")
    public void removeProductItem(
            @Parameter(description = "id của item", example = "1") @PathVariable(value = "id") int productItemId) {
        String oldImgPath = productService.getProductItem(productItemId).getProductImage();
        if (productService.removeProductItem(productItemId))
            imageService.removeImage(oldImgPath, ImageType.PRODUCT);
    }

    @Operation(summary = "Lấy sản phẩm trong cart theo id", description = "Trả về sản phẩm trong cart có id tương ứng")
    @GetMapping(path = "/item/{id}")
    public ProductItem getProductItem(
            @Parameter(description = "id của sản phẩm trong cart", example = "1") @PathVariable(value = "id") int cartId) {
        return productService.getProductItem(cartId);
    }

    @Operation(summary = "Lấy danh sách review theo id của sản phẩm", description = "Trả về danh sách review theo id của sản phẩm")
    @GetMapping("/review/{product-id}")
    public List<ReviewDto> getProductReviews(
            @Parameter(description = "id của sản phẩm", example = "1") @PathVariable(value = "product-id") int productId) {
        return convertToReviewDtoList(productService.getProductReviews(productId));
    }

    @Operation(summary = "Lấy review theo id người dùng và id của sản phẩm", description = "Trả về review theo id của người dùng và id của sản phẩm")
    @GetMapping("/review/{product-id}/user/{user-id}")
    public ReviewDto getReview(
            @Parameter(description = "id của sản phẩm", example = "1") @PathVariable(value = "product-id") int productId,
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "user-id") int userId) {
        var data = productService.getReviewByUserIdAndProductId(userId, productId);
        return data == null ? null : new ReviewDto(data);
    }

    @Operation(summary = "Review sản phẩm", description = "Tạo review cho sản phẩm")
    @PostMapping("/review/new")
    public void reviewProduct(@RequestBody ReviewDto reviewDto) {
        productService.reviewProduct(new Review(reviewDto));
    }

    @Operation(summary = "Xóa review sản phẩm", description = "Xóa review của sản phẩm theo id")
    @DeleteMapping("/review/delete/{id}")
    public void deleteProductReview(
            @Parameter(description = "id của review", example = "1") @PathVariable(value = "id") int reviewId) {
        productService.deleteProductReview(reviewId);
    }

    @GetMapping("/related")
    public List<Product> getRelatedProduct(
            @RequestParam(value = "product_id") Integer productId,
            @RequestParam(required = false, value = "user_id") Integer userId) {
        try {
            String url = "http://localhost:8000/api/v1";
            if (userId != null && productService.getReviewCountByUserId(userId)>=5) 
                url += "/recommend?product_id=" + productId + "&user_id=" + userId;
            else url+="/cb-recommend?product_id=" + productId;
            var result = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            List<Integer> productIdList = mapper.readValue(result, new TypeReference<List<Integer>>() {
            });
            List<Product> relatedProduct = new ArrayList<>();
            for (Integer i : productIdList)
                relatedProduct.add(productService.getProduct(i));
            return relatedProduct;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @GetMapping("/update-ai")
    public ResponseEntity<Object> updateAI() {
        try {
            String url = "http://localhost:8000/api/v1/update-data";
            restTemplate.getForEntity(url, null);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Lấy hình ảnh của sản phẩm", description = "Hình ảnh của sản phẩm theo tên ảnh ")
    @GetMapping("/image/{imageName}")
    public ResponseEntity<Object> getImage(
            @Parameter(description = "Tên file ảnh", example = "abc.png") @PathVariable String imageName) {
        Object image = imageService.getImage(imageName, ImageType.PRODUCT);
        return image == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("image/" + imageName.split("\\.")[1]))
                        .body(image);
    }

    private List<ProductDto> convertToProductDtoList(List<Product> products) {
        if (products == null)
            return null;
        List<ProductDto> productDtoLst = new ArrayList<>();
        for (var p : products)
            productDtoLst.add(new ProductDto(p));
        return productDtoLst;
    }

    private List<SimpleProductData> convertToSimpleProductDataList(List<Product> products) {
        if (products == null)
            return null;
        List<SimpleProductData> simpleProductDataLst = new ArrayList<>();
        for (var p : products)
            simpleProductDataLst.add(new SimpleProductData(p));
        return simpleProductDataLst;
    }

    private List<SimpleReviewData> convertToSimpleReviewDataList(List<Review> reviews) {
        if (reviews == null)
            return null;
        List<SimpleReviewData> simpleReviewDataLst = new ArrayList<>();
        for (var r : reviews)
            simpleReviewDataLst.add(new SimpleReviewData(r));
        return simpleReviewDataLst;
    }

    private List<ReviewDto> convertToReviewDtoList(List<Review> reviews) {
        if (reviews == null)
            return null;
        List<ReviewDto> reviewDtoLst = new ArrayList<>();
        for (var r : reviews)
            reviewDtoLst.add(new ReviewDto(r));
        return reviewDtoLst;
    }
}
