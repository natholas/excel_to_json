var columns = [];

	function convert() {

		var input = document.getElementById('input').value,
		input = input.split("\n"),
		rows = [],
		data = {};

		if (input.length < 2) return "Error: At least 2 columns are needed.";

		for (var i = 0; i < input.length; i++) {
			if (input[i].split('"').length % 2 == 0) {
				if (input.length -1 <= i) return "Error. Missing quotation on last line.";
				input[i] += input[i + 1];
				input.splice(i+1, 1);
				i -= 1;
			}

			rows.push(input[i].split("	"));
		}

		// Adding the first row of the data as the columns
		columns = rows[0].splice(1);

		for (var i = 0; i < columns.length; i++) {

			data[columns[i]] = "{";

			for (var ii = 1; ii < rows.length; ii++) {

				if (rows[ii].length - 1 != columns.length) {
					if (rows[ii].length <= 1) {
						rows.splice(ii, 1);
						ii -= 1;
					} else return "Error: Length of row " + ii + " doesnt match that of header column.";
				}

				if (!rows[ii]) return "Error: Not sure what this error message is for anymore.";
				if (!rows[ii][i + 1]) continue;
				rows[ii][i + 1] = rows[ii][i + 1].split('"').join('\\"');

				if (rows[ii][i + 1].length != 0) data[columns[i]] += '"' + [rows[ii][0]] + '":"' + rows[ii][i + 1] + '",';

			}

			if (data[columns[i]].length <= 1) return "Error: You need more than one row";
			
			data[columns[i]] = data[columns[i]].substring(0, data[columns[i]].length - 1);
			data[columns[i]] = data[columns[i]].split('"\\"').join('"');
			data[columns[i]] = data[columns[i]].split('\\""').join('"');

			data[columns[i]] += "}";
		}

		return data;
	}

	function prep_download(data) {

		if (typeof data == "string") {
			document.getElementById('error').innerHTML = "<span>" + data + "</span>";
			return "error";
		}

		document.getElementById('error').innerHTML = "";

		var download_box = document.getElementById('downloads');

		download_box.innerHTML = "";

		for (var i = 0; i < columns.length; i++) {
			if (!columns[i].length) continue;
			var download_link = document.createElement("a");
			download_link.innerHTML = "download " + columns[i];
			download_link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data[columns[i]]);
			download_link.download = columns[i] + ".json";
			download_link.title = size_calc(data[columns[i]]);
			download_link.className = "animate animation_delay_" + i;
			download_box.appendChild(download_link);
			set_animation_delay(download_link, i);
		}
	}

	function set_animation_delay(element, i) {
		setTimeout(function () {
			element.style.animationPlayState = "running";
		}, 150 * (i + 1));
	}

	function convert_and_download() {
		s = performance.now();
		var result = prep_download(convert());
		e = performance.now();
		if (result != "error") document.getElementById('speed').innerHTML = "Done in:" + (e-s).toFixed(2) + " milliseconds";
	}

	function size_calc(string) {
		var bytes = string.toString().length,
		suffix = " bytes";
		if (bytes >= 1000000) {
			bytes = bytes / 1000000;
			suffix = " MB";
		} else if (bytes >= 1000) {
			bytes = bytes / 1000;
			suffix = " KB";
		}

		return bytes.toFixed(2) + suffix;
	}
