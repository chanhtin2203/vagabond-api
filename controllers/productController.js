const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const productController = {
  // Create new product
  createNewProduct: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "vagabond-img",
        use_filename: true,
      });

      let products = new Product({
        ...req.body,
        image: result.secure_url,
        cloudinary_id: result.public_id,
      });
      const saveProduct = await products.save();
      return res.status(200).json(saveProduct);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Update Product
  updateProduct: async (req, res) => {
    try {
      let products = await Product.findById(req.params.id);

      await cloudinary.uploader.destroy(products.cloudinary_id);

      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "vagabond-img",
        use_filename: true,
      });

      const data = {
        ...req.body,
        image: result.secure_url || products.image,
        cloudinary_id: result.public_id || products.cloudinary_id,
      };

      products = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Delete
  deleteProduct: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      await cloudinary.uploader.destroy(product.cloudinary_id);
      await product.remove();
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get product
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // Get all Product
  getAllProduct: async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;

      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = productController;
