package com.ggori_salang.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") //클래스별 공통 URL(prefix)
public class TestController {
    //DB 대신에 LIST 사용
    private static final List<Map<String, Object>> productList = new ArrayList<>();
    private static int nextId = 1;

    @RequestMapping("/hello")
    public String hello() {
        return "Hello, World";
    }
    @GetMapping("/name")
    public String getName() {
        return "휴먼교육센터";
    }
    @GetMapping("/post/{id}")
    public String getPost(@PathVariable String id) {
        return id;
    }

    //http://localhost:8111/api/request?name=곰돌이&email=asd@naver.com&phone=010-1234-1234
    @GetMapping("/request")
    public String getRequestParam(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone
    ) {
        return name + " " + email + " " + phone;
    }

    //email, pwd, name 전송해서 수신받기
    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> map) {
        Map<String, String> result = new HashMap<>();
        result.put("name", map.get("name"));
        result.put("email", map.get("email"));
        result.put("pwd", map.get("pwd"));
        return result.toString();
    }
    //email, pwd를 입력해서 로그인 성공 실패를 전달
    //반환값은 boolean
    @PostMapping("/loginTest")
    public boolean loginTest(@RequestBody Map<String, String> map) {
        String email = map.get("email");
        String pwd = map.get("pwd");

        if("asd@naver.com".equals(email) && "asd123".equals(pwd)){
            return true;
        }
        return false;
    }

    //id(자동 증가)name,price,category, desc
    @PostMapping("/product")
    public Map<String, Object> createProduct(@RequestBody Map<String, String> map) {
        Map<String, Object> product = new HashMap<>();
        product.put("id", nextId++);
        product.put("name", map.get("name"));
        product.put("price", map.get("price"));
        product.put("category", map.get("category"));
        product.put("desc", map.get("desc"));

        productList.add(product);
        return product;
    }

    //get으로 상품 조회하기
    @GetMapping("/display")
    public List<Map<String, Object>> getAllProducts() {
        return productList;
    }
    //put으로 상품 수정하기
    @PutMapping("/modify/{id}")
    public Map<String, Object> updateProduct(
            @PathVariable int id,
            @RequestBody Map<String, String> map) {
        for(Map<String, Object> product : productList) {
            if(product.get("id").equals(id)) {
                product.put("name",map.get("name"));
                product.put("price",map.get("price"));
                product.put("category",map.get("category"));
                product.put("desc",map.get("desc"));
                return product;
            }
        }
        return null;
    }
    //delete로 상품 삭제하기
    @DeleteMapping("/product/{id}")
    public String deleteProduct(@PathVariable int id) {
        for(int i = 0; i < productList.size(); i++) {
            Map<String, Object> product = productList.get(i);

            if(product.get("id").equals(id)) {
                productList.remove(i);
                return id + "상품 삭제";
            }
        }
        return null;
    }
}
