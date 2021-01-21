const { User } = require("../models/user.model");
const router = require("express").Router();
let Plant = require("../models/plant.model");

router.get("/", async (req, res) => {
  // let filter = User.findById(req.body.id);
  // const plantList = await Plant.find(filter)
  const plantList = await Plant.find()
  .select("nickname type wateringFrequency pottyChange notes -_id");

  if(!plantList) {
    res.status(500).json({success: false})
  }
  res.send(plantList);
});

router.post("/add", async (req, res) => {
  const userid = await User.findById(req.body.id);
  if(!userid) return res.status(400).send('Invalid userid')

  const newPlant = new Plant({
    userid: req.body.userid,
    nickname: req.body.nickname,
    type: req.body.type,
    wateringFrequency: req.body.wateringFrequency,
    pottyChange: Date.parse(req.body.pottyChange),
    notes: req.body.notes,
  })
  newPlant = await newPlant.save();

  if(!newPlant)
  return res.status(500).send("The plant could not be added.")

  res.send(newPlant);
});

router.route("/:id").get((req, res) => {
  Plant.findById(req.params.id)
    .then((plant) => res.json(plant))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Plant.findByIdAndDelete(req.params.id)
    .then(() => res.json("Plant deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Plant.findById(req.params.id)
    .then((plant) => {
      plant.userid = req.body.userid;
      plant.nickname = req.body.nickname;
      plant.type = req.body.type;
      plant.wateringFrequency = req.body.wateringFrequency;
      plant.pottyChange = Date.parse(req.body.pottyChange);
      plant.notes = req.body.notes;

      plant
        .save()
        .then(() => res.json("Plant updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;