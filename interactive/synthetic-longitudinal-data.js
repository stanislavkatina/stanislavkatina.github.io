(function () {
  const visits = ["Baseline", "Week 4", "Week 8", "Week 12", "Week 16", "Week 24"];
  let seed = 72819;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const normal = () => Math.sqrt(-2 * Math.log(Math.max(random(), 1e-8))) * Math.cos(2 * Math.PI * random());
  const records = [];

  for (let group = 0; group < 2; group += 1) {
    for (let subject = 1; subject <= 52; subject += 1) {
      const id = `${group === 0 ? "A" : "B"}-${String(subject).padStart(3, "0")}`;
      const randomIntercept = 7 * normal();
      const randomSlope = 1.1 * normal();
      const dropoutVisit = subject > 48 ? 4 : subject > 45 ? 5 : visits.length;

      visits.forEach((visit, visitIndex) => {
        if (visitIndex >= dropoutVisit) return;
        const mean = visitIndex === 0 ? 0 : (group === 0 ? 2.5 : -1.25) * visitIndex;
        const value = visitIndex === 0
          ? 0
          : mean + randomIntercept + randomSlope * visitIndex + (7 + 0.8 * visitIndex) * normal();
        records.push({ id, group, visit, visitIndex, value, review: false });
      });
    }
  }

  const review = records.find((d) => d.id === "A-014" && d.visitIndex === 4);
  if (review) {
    review.value = 175;
    review.review = true;
  }

  window.syntheticLongitudinal = {
    visits,
    groups: ["Group A", "Group B"],
    records,
    design: "Stable synthetic subjects with correlated repeated measurements and monotone dropout"
  };
}());
