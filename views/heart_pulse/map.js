function(doc) {
    if (doc.type == "health") {
        if (typeof(doc.heart.pulse) !== "undefined") {
            emit([doc.date, doc.time], doc.heart.pulse);
        }
    }
};
