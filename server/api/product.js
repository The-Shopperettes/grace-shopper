const router = require("express").Router();
const { Product } = require("../db").models;
const { requireAdmin } = require("./middleware");
const { Sequelize, Op } = require("sequelize");

// get all products
router.put("/", async (req, res, next) => {
  try {
    //get the filters
    let query = {};
    const { selections } = req.body;
    if (selections.cycle.length) query.cycle = { [Op.or]: selections.cycle };
    if (selections.sunlight.length)
      query.sunlight = {
        [Op.iLike]: {
          [Op.any]: selections.sunlight.map((selected) => `%${selected}%`),
        },
      };
    if (selections.watering.length)
      query.watering = { [Op.or]: selections.watering };

    // set page to the query, or default to 1
    const page = req.query.page || 1;
    // set the perPage limit to the query, or default to 9
    const perPage = req.query.perPage || 9;

    const search = req.query.search || "";

    // calculate the offset
    const offset = (page - 1) * perPage;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `${search}%`,
        },
        ...query,
      },
      offset,
      limit: perPage,
      order: [req.body.sort],
    });

    async function getFilter(type) {
      let otherFilters = {};
      for (let key of Object.keys(query)) {
        if (key !== type) otherFilters[key] = query[key];
      }

      const searchQuery = `${search}%`;

      const options = await Product.findAll({
        attributes: [[type, "value"]],

        where: {
          name: {
            [Op.iLike]: searchQuery,
          },
        },

        group: [type],
      });

      const counts = await Product.findAll({
        attributes: [
          [type, "value"],
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.fn("DISTINCT", Sequelize.col("id"))
            ),
            "count",
          ],
        ],

        where: {
          name: {
            [Op.iLike]: searchQuery,
          },
          ...otherFilters,
        },

        group: [type],
      });

      for (let { dataValues } of counts) {
        const { count, value } = dataValues;
        const idx = options.findIndex((opt) => opt.dataValues.value === value);
        if (idx >= 0) options[idx].dataValues.count = count;
      }

      return { type, options };
    }

    const getSunFilters = async () => {
      const types = [
        "Deciduous shade",
        "Full sun",
        "Part sun/Part shade",
        "Deep shade",
        "Filtered shade",
        "Partial sun",
        "Partial shade",
      ];

      const otherFilters = {};
      if (query.watering) otherFilters.watering = query.watering;
      if (query.cycle) otherFilters.cycle = query.cycle;

      //find out how many there are of each option
      const options = await Promise.all(
        types.map(async (type) => {
          //if there's no options based on the search, don't count it
          const withSearch = await Product.count({
            where: {
              sunlight: {
                [Op.iLike]: `%${type}%`,
              },
              name: {
                [Op.iLike]: `${search}%`,
              },
            },
          });

          if (withSearch === 0) return;
          const count = await Product.count({
            where: {
              sunlight: {
                [Op.iLike]: `%${type}%`,
              },
              name: {
                [Op.iLike]: `${search}%`,
              },
              ...otherFilters,
            },
          });
          return { value: type, count };
        })
      );

      return { type: "sunlight", options: options.filter((opt) => !!opt) };
    };

    const [cycle, watering, sunlight] = await Promise.all([
      ...["cycle", "watering"].map(getFilter),
      getSunFilters(),
    ]);

    res.json({ products: rows, count, cycle, sunlight, watering });
  } catch (err) {
    next(err);
  }
});

// get array of up to 5 products based on string
router.get("/autocomplete", async (req, res, next) => {
  try {
    const { search } = req.query;
    if (!search) res.json([]);

    let products = await Product.findAll({
      attributes: ["name"],
      where: {
        name: {
          [Op.iLike]: `${search}%`,
        },
      },
      limit: 5,
    });

    res.json(products.map(({ name }) => name));
  } catch (err) {
    next(err);
  }
});

//get the options for filters: cycle, watering, sunlight
router.get("/filters", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

// get single product
router.get("/:id", async (req, res, next) => {
  try {
    res.send(await Product.findByPk(req.params.id));
  } catch (err) {
    next(err);
  }
});

//add a product
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    res.send(await Product.create(req.body));
  } catch (error) {
    next(error);
  }
});

//delete single product
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send();
  } catch (err) {
    next(err);
  }
});

//edit single product
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });

    res.send(await Product.findByPk(req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
