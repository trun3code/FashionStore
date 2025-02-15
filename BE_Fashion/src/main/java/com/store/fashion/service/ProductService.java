package com.store.fashion.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.store.fashion.model.Category;
import com.store.fashion.model.Product;
import com.store.fashion.model.ProductItem;
import com.store.fashion.model.Review;
import com.store.fashion.repository.CategoryRepository;
import com.store.fashion.repository.ProductItemRepository;
import com.store.fashion.repository.ProductRepository;
import com.store.fashion.repository.ReviewRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductItemRepository productItemRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    // -- products

    // get all product
    public List<Product> getAllProduct() {
        var rs = productRepository.findAll();
        Collections.reverse(rs);
        return rs;
    }

    // get full product
    public List<Product> getFullProduct() {
        var rs = productRepository.findAll();
        Collections.reverse(rs);
        for (int i = 0; i < rs.size(); i++) {
            var productItems = getProductItems(rs.get(i).getId());
            if (productItems == null)
                continue;
            for (ProductItem productItem : productItems)
                productItem.setProduct(null);
            rs.get(i).setItems(productItems);
        }
        return rs;
    }

    // filter
    public List<Product> getProductsFilter(Map<String, String> filter) {
        try {
            List<Product> rs = new ArrayList<>();
            int min = 0, max = Integer.MAX_VALUE;
            String priceString = filter.get("price");
            if (priceString != null) {
                var strArr = priceString.split(",");
                min = Integer.parseInt(strArr[0]);
                max = Integer.parseInt(strArr[1]);
            }
            List<Product> products = getAllProduct();
            for (Product product : products) {
                boolean valid = true;
                for (Category c : product.getCategories()) {
                    String name = filter.get(c.getType());
                    if (name == null)
                        continue;
                    if (!c.getName().equals(name)) {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
                int productPrice = product.getPrice() * (100 - product.getSale()) / 100;
                if (productPrice <= max && productPrice >= min)
                    rs.add(product);
            }
            return rs;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // recommend
    public List<Product> getRelatedProducts() {
        return null;
    }

    // hot product
    public List<Product> getHotProducts() {
        var products = productRepository.findAll(Sort.by("sold").reverse());
        int maxIndex = Math.min(4, products.size());
        return products.subList(0, maxIndex);
    }

    // -- product item

    // get all product item by product id
    public List<ProductItem> getProductItems(int productId) {
        var rs = productItemRepository.findByProductId(productId);
        return rs.size() == 0 ? null : rs;
    }

    // get product item by id
    public ProductItem getProductItem(int productItemId) {
        var rs = productItemRepository.findById(productItemId);
        return rs.isEmpty() ? null : rs.get();
    }

    // create product item
    public ProductItem createProductItem(ProductItem productItem, int productId) {
        try {
            Product product = new Product();
            product.setId(productId);
            productItem.setProduct(product);
            updateProductUpdatedTime(productId);
            return productItemRepository.save(productItem);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // update product item
    public ProductItem updateProductItem(ProductItem productItem, int productId) {
        try {
            Product product = new Product();
            product.setId(productId);
            productItem.setProduct(product);
            updateProductUpdatedTime(productId);
            return productItemRepository.save(productItem);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // delete product item by id
    public boolean removeProductItem(int productItemId) {
        var temp = productItemRepository.findById(productItemId);
        if (temp.isEmpty())
            return false;
        productItemRepository.deleteById(productItemId);
        updateProductUpdatedTime(temp.get().getProduct().getId());
        return true;
    }

    // -- product

    // create product
    public Product createProduct(Product product) {
        try {
            product.setId(0);
            var categories = new ArrayList<Category>();
            var allCategories = categoryRepository.findAll();
            for (Category curC : product.getCategories()) {
                for (Category c : allCategories) {
                    if (curC.getName().equals(c.getName())) {
                        categories.add(c);
                        break;
                    }
                }
            }
            product.setCategories(categories);
            product.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            return productRepository.save(product);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // get product by id
    public Product getProduct(int productId) {
        var rs = productRepository.findById(productId);
        return rs.isEmpty() ? null : rs.get();
    }

    // delete product by id
    public boolean removeProduct(int productId) {
        if (!productRepository.existsById(productId))
            return false;
        productRepository.deleteById(productId);
        return true;
    }

    // update product time
    public void updateProductUpdatedTime(int productId) {
        var temp = productRepository.findById(productId);
        if (temp.isEmpty())
            return;
        Product curProduct = temp.get();
        curProduct.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        productRepository.save(curProduct);
    }

    // update product
    public Product updateProduct(Product product) {
        var temp = productRepository.findById(product.getId());
        if (temp.isEmpty())
            return null;
        Product curProduct = temp.get();
        curProduct.setProductName(product.getProductName());
        if (product.getProductImage() != null)
            curProduct.setProductImage(product.getProductImage());
        curProduct.setPrice(product.getPrice());
        curProduct.setSale(product.getSale());
        curProduct.setDescription(product.getDescription());
        curProduct.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        curProduct.setCategories(new ArrayList<>());
        var categories = categoryRepository.findAll();
        for (Category curC : product.getCategories()) {
            for (Category c : categories) {
                if (curC.getName().equals(c.getName())) {
                    curProduct.getCategories().add(c);
                    break;
                }
            }
        }
        return productRepository.save(curProduct);
    }

    // + sold amount
    public boolean addProductSold(int productId, int amount) {
        Product product = getProduct(productId);
        if (product == null || amount <= 0)
            return false;
        try {
            product.setSold((product.getSold() == null ? 0 : product.getSold()) + amount);
            productRepository.save(product);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // + product item amount
    public boolean addProductItemAmount(int productItemId, int amount) {
        ProductItem productItem = getProductItem(productItemId);
        if (productItem == null || amount <= 0)
            return false;
        try {
            productItem.setQuantity(productItem.getQuantity() + amount);
            productItemRepository.save(productItem);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    // - product item amount
    public boolean subtractProductItemAmount(int productItemId, int amount) {
        ProductItem productItem = getProductItem(productItemId);
        if (productItem == null || amount <= 0 || amount > productItem.getQuantity())
            return false;
        try {
            productItem.setQuantity(productItem.getQuantity() - amount);
            productItemRepository.save(productItem);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // -- review
    public List<Review> getAllReview() {
        return reviewRepository.findAll();
    }

    // create review
    public boolean reviewProduct(Review review) {
        try {
            review.setId(0);
            review.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            reviewRepository.save(review);
            var reviews = getProductReviews(review.getProductId());
            Product p = getProduct(review.getProductId());
            float avgStar = 0;
            for (Review r : reviews)
                avgStar += r.getRating();
            p.setRating(1f * Math.round(avgStar / reviews.size() * 100) / 100);
            productRepository.save(p);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // get review count of user
    public long getReviewCountByUserId(Integer userId) {
        if (userId == null)
            return 0;
        return reviewRepository.countByUserId(userId);
    }

    // get all review by product id
    public List<Review> getProductReviews(int productId) {
        var rs = reviewRepository.findByProductId(productId);
        Collections.reverse(rs);
        return rs;
    }

    // delete review by review id
    public boolean deleteProductReview(int reviewId) {
        if (!reviewRepository.existsById(reviewId))
            return false;
        reviewRepository.deleteById(reviewId);
        return true;
    }

    // get review by userId and productId
    public Review getReviewByUserIdAndProductId(int userId, int productId) {
        return reviewRepository.findByUserIdAndProductId(userId, productId);
    }
}
