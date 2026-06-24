const element = (element) => document.getElementById(element);

element("selectedFile").addEventListener("change", async function (event) {
	const file = element("selectedFile").files[0];
	if (!file) { alert("Error: No file chosen"); return; }

	const fileName = file.name;
	const fileContents = await file.arrayBuffer();
	const bytes = new Uint8Array(fileContents);

	bitsToImage(bytes, [5, 5, 4], 480, element("outputCanvas"));
});