// Tạo bản đồ với tọa độ mặc định
const map = L.map("map").setView([16.047079, 108.20623], 13); // Đà Nẵng

// Thêm layer bản đồ từ OSM
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Lấy vị trí hiện tại của người dùng
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const lat = position.coords.latitude; // Vĩ độ
			const lng = position.coords.longitude; // Kinh độ

			// Thêm marker tại vị trí hiện tại
			const marker = L.marker([lat, lng])
				.addTo(map)
				.bindPopup("Bạn đang ở đây nè hjhj")
				.openPopup();

			// Di chuyển bản đồ đến vị trí người dùng
			map.setView([lat, lng], 15);
		},
		function (error) {
			alert("Không thể lấy vị trí: " + error.message);
		}
	);
} else {
	alert("Trình duyệt không hỗ trợ định vị.");
}

const sheetId = "175hcG79IKLznuzW06-LGlHbbEZYtjiec3DfYeyeCEyU";
const sheetName = "Câu trả lời biểu mẫu 1"; // đúng tên tab
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
	sheetName
)}`;

fetch(url)
	.then((res) => res.text())
	.then((data) => {
		const jsonData = JSON.parse(data.substring(47).slice(0, -2));
		const rows = jsonData.table.rows;

		rows.forEach((row) => {
			const name = row.c[1]?.v || ""; // Tên món ăn
			const address = (row.c[2]?.v || "") + " " + (row.c[3]?.v || ""); // Địa chỉ
			const timeOpen = row.c[4]?.v || ""; // Giờ mở cửa
			const note = row.c[5]?.v || ""; // Ghi chú
			const lat = parseFloat(
				(row.c[6]?.v || "0").toString().replace(",", ".")
			); // Lat
			const lng = parseFloat(
				(row.c[7]?.v || "0").toString().replace(",", ".")
			); // Lng

			if (!isNaN(lat) && !isNaN(lng)) {
				L.marker([lat, lng])
					.addTo(map)
					.bindPopup(
						`<b>${name}</b><br>${address}<br>Giờ mở cửa: ${timeOpen}<br>${note}`
					);
			}
		});
	})
	.catch((err) => {
		console.error("Lỗi khi lấy dữ liệu:", err);
	});
