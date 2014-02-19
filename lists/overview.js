 
function(head, req) {
    var row;
    provides("html", function() {
        var html ="<html><body><table border=1>\n";
        html += "<tr>";
        html += "<th>Datum</th>";
        html += "<th>Uhrzeit</th>";
        html += "<th>Puls</th>";
        html += "<th>Systolisch</th>";
        html += "<th>Diastolisch</th>";
        html += "</tr>";
        
        while(row = getRow()) {
            if (typeof(row.value.heart) !== "undefined") {
                html +="<tr>";
                html +="<td>" + row.value.date +"</td>";
                html +="<td>" + row.value.time +"</td>";
                html += "<td>" + row.value.heart.pulse + "</td>";
                
                if (typeof(row.value.heart.pressure) !== "undefined") {
                    html += "<td>" + row.value.heart.pressure.systolic + "</td>";
                    html += "<td>" + row.value.heart.pressure.diastolic + "</td>";
                }
                html+="</tr>";
            }
        }
        html += "</table></body></html>";
        return html;
    });
}