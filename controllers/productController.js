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
    const qSize = req.query.size;
    const qCategory = req.query.category;
    const qRandom = req.query.random;
    const qSearch = req.query.search;

    try {
      let products;
      if (qSearch) {
        products = await Product.find({
          $text: { $search: `\"${qSearch}\"` },
        });
      } else if (qRandom) {
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        products = await Product.find();
        shuffleArray(products);
      } else if (qCategory && qSize) {
        products = await Product.find({
          category: {
            $in: [qCategory],
          },
        }).limit(qSize);
      } else if (qCategory) {
        products = await Product.find({
          category: {
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
  filterProducts: async (req, res) => {
    const filter = req.query.filter;
    const qCategory = req.query.category;
    function checkFilter(type) {
      return type.includes(filter);
    }
    try {
      let products;

      if (filter) {
        switch (true) {
          case checkFilter("under100000"):
            products = await Product.find({
              price: { $lte: 100000 },
            });
            break;
          case checkFilter("range:100000_250000"):
            products = await Product.find({
              price: { $gte: 100000, $lte: 250000 },
            });
            break;
          case checkFilter("range:250000_500000"):
            products = await Product.find({
              price: { $gte: 250000, $lte: 500000 },
            });
            break;
          case checkFilter("range:500000_800000"):
            products = await Product.find({
              price: { $gte: 500000, $lte: 800000 },
            });
            break;
          case checkFilter("on800000"):
            products = await Product.find({
              price: { $gte: 800000 },
            });
            break;
          case checkFilter("under100000,range:100000_250000"):
            products = await Product.find({
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000"
          ):
            products = await Product.find({
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000,range:500000_800000"
          ):
            products = await Product.find({
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
                { price: { $gte: 500000, $lte: 800000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000,range:500000_800000,on800000"
          ):
            products = await Product.find({
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
                { price: { $gte: 500000, $lte: 800000 } },
                { price: { $gte: 800000 } },
              ],
            });
            break;
          default:
            break;
        }
      }

      if (filter && qCategory) {
        switch (true) {
          case checkFilter("under100000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              price: { $lte: 100000 },
            });
            break;
          case checkFilter("range:100000_250000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              price: { $gte: 100000, $lte: 250000 },
            });
            break;
          case checkFilter("range:250000_500000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              price: { $gte: 250000, $lte: 500000 },
            });
            break;
          case checkFilter("range:500000_800000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              price: { $gte: 500000, $lte: 800000 },
            });
            break;
          case checkFilter("on800000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              price: { $gte: 800000 },
            });
            break;
          case checkFilter("under100000,range:100000_250000"):
            products = await Product.find({
              category: { $in: [qCategory] },
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000"
          ):
            products = await Product.find({
              category: { $in: [qCategory] },
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000,range:500000_800000"
          ):
            products = await Product.find({
              category: { $in: [qCategory] },
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
                { price: { $gte: 500000, $lte: 800000 } },
              ],
            });
            break;
          case checkFilter(
            "under100000,range:100000_250000,range:250000_500000,range:500000_800000,on800000"
          ):
            products = await Product.find({
              category: { $in: [qCategory] },
              $or: [
                { price: { $lte: 100000 } },
                { price: { $gte: 100000, $lte: 250000 } },
                { price: { $gte: 250000, $lte: 500000 } },
                { price: { $gte: 500000, $lte: 800000 } },
                { price: { $gte: 800000 } },
              ],
            });
            break;
          default:
            break;
        }
      }
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = productController;
