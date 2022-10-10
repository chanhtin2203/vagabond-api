const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
    const qLte = req.query.lte;
    const qGte = req.query.gte;
    const qSize = req.query.size;
    const qCategory = req.query.category;
    const qSort = req.query.sort;
    const qValue = req.query.value;

    try {
      let products;
      // no category
      if (qLte && qGte) {
        products = await Product.find({
          price: { $lte: qLte, $gte: qGte },
        });
      }

      if (qSize) {
        products = await Product.find({
          size: { $in: qSize },
        });
      }

      if (qSort) {
        products = await Product.find().sort({
          [qSort]: qValue,
        });
        if (qSort === "hot-product") {
          products = await Product.find();
          shuffleArray(products);
        }
      }

      if (qLte && qGte && qSize) {
        products = await Product.find({
          price: { $lte: qLte, $gte: qGte },
          size: { $in: qSize },
        });
      }

      if (qLte && qGte && qSort) {
        products = await Product.find({
          price: { $lte: qLte, $gte: qGte },
        }).sort({
          [qSort]: qValue,
        });
      }

      if (qSize && qSort) {
        products = await Product.find({
          size: { $in: qSize },
        }).sort({
          [qSort]: qValue,
        });
      }

      if (qLte && qGte && qSort && qSize) {
        products = await Product.find({
          price: { $lte: qLte, $gte: qGte },
          size: { $in: qSize },
        }).sort({
          [qSort]: qValue,
        });
      }

      // filter by category
      if (qLte && qGte && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
          price: { $lte: qLte, $gte: qGte },
        });
      }

      if (qSize && qCategory) {
        products = await Product.find({
          size: { $in: qSize },
        });
      }

      if (qSort && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
        }).sort({
          [qSort]: qValue,
        });
        if (qSort === "hot-product") {
          products = await Product.find({
            category: { $in: [qCategory] },
          });
          shuffleArray(products);
        }
      }

      if (qLte && qGte && qSize && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
          price: { $lte: qLte, $gte: qGte },
          size: { $in: qSize },
        });
      }

      if (qLte && qGte && qSort && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
          price: { $lte: qLte, $gte: qGte },
        }).sort({
          [qSort]: qValue,
        });
      }

      if (qSize && qSort && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
          size: { $in: qSize },
        }).sort({
          [qSort]: qValue,
        });
      }

      if (qLte && qGte && qSort && qSize && qCategory) {
        products = await Product.find({
          category: { $in: [qCategory] },
          price: { $lte: qLte, $gte: qGte },
          size: { $in: qSize },
        }).sort({
          [qSort]: qValue,
        });
      }

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = productController;
