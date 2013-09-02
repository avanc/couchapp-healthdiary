function(doc) {
    if (doc.type == "health") {
        if (typeof(doc.weight) !== "undefined") {
            if (doc.weight.naked ==true) {
                emit([doc.date, doc.time], doc.weight.value);
            }
        }
    }
};
