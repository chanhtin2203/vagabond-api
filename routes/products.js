const middlewareController = require("../controllers/middlewareController");
const productController = require("../controllers/productController");
const upload = require("../utils/multer");
const router = require("express").Router();

// Create
router.post(
  "/",
  middlewareController.verifyTokenAndAuthAdmin,
  upload.single("image"),
  productController.createNewProduct
);

// Update
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  upload.single("image"),
  productController.updateProduct
);

// Delete
router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAndAuthAdmin,
  productController.deleteProduct
);

// get product
router.get("/find/:id", productController.getProduct);

// get all product
router.get("/", productController.getAllProduct);

// search products
router.get("/", productController.searchProducts);

module.exports = router;
