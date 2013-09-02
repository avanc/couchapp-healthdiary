function(doc) {
    if (doc.type == "health") {
        if (typeof(doc.heart.pressure) !== "undefined") {
            emit([doc.date, doc.time], {diastolic: doc.heart.pressure.diastolic, systolic: doc.heart.pressure.systolic});
        }
    }
};
