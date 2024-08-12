const clothoidize = (function () {
	var t = {
		'0.00': [0, 0],
		0.05: [654497748e-13, 0.04999992289],
		'0.10': [0.000523589545, 0.09999753263],
		0.15: [0.001766988205, 0.1499812643],
		'0.20': [0.00418760916, 0.1999210576],
		0.25: [0.008175600235, 0.2497591504],
		'0.30': [0.01411699801, 0.2994009761],
		0.35: [0.02238999474, 0.3487062942],
		'0.40': [0.03335943266, 0.3974807592],
		0.45: [0.04736922221, 0.4454682287],
		'0.50': [0.06473243286, 0.4923442259],
		0.55: [0.08571888733, 0.5377110861],
		'0.60': [0.1105402074, 0.581095447],
		0.65: [0.1393324215, 0.6219488539],
		'0.70': [0.1721364579, 0.6596523519],
		0.75: [0.2088771112, 0.6935259908],
	};
	function n(n: number) {
    type KeyofT = keyof typeof t;
		const e = Math.ceil(20 * n) / 20,
			o = Math.floor(20 * n) / 20,
			a = t[e.toFixed(2) as KeyofT],
			i = t[o.toFixed(2) as KeyofT];
		if (e == o) return a;
		const c = n - o + (e - n);
		return [
			((n - o) * a[0] + (e - n) * i[0]) / c,
			((n - o) * a[1] + (e - n) * i[1]) / c,
		];
	}
	const e = Math.sin((45 * Math.PI) / 180);
	let o = n(e),
		a = o[0] + o[1];
	function i(t: number) {
		return parseFloat(t.toFixed(6));
	}
	function c(t: number, o: number, c: number, r: 'px', l: number, s: string) {
		let d,
			u,
			p = [],
			[f, h] = n(e);
		for (var m = 0; m <= e; m += e / l) {
			const t = n(m);
			(d = t[1] * c), (u = t[0] * c), p.push([d, u]);
		}
		let y = d!,
			v = u!;
		for (var g = e; g >= 0; g -= e / l) {
			const t = n(g);
			(d = y + (f - t[0]) * c), (u = v + (h - t[1]) * c), p.push([d, u]);
		}
		t > 0 &&
			o < 0 &&
			((p = p.map((t) => [t[0] - a * c, -t[1] + a * c])), p.reverse()),
			t < 0 &&
				o > 0 &&
				((p = p.map((t) => [-t[0] + a * c, t[1] - a * c])), p.reverse()),
			t < 0 && o < 0 && (p = p.map((t) => [-t[0], -t[1]]));
		let b = p.map((t) => {
				let n, e;
				switch (s) {
					case 'top right':
						(n = `calc(100% - ${i(a * c - t[0])}${r})`), (e = i(t[1]) + r);
						break;
					case 'bottom right':
						(n = `calc(100% - ${i(-1 * t[0])}${r})`),
							(e = `calc(100% - ${i(a * c - t[1])}${r})`);
						break;
					case 'bottom left':
						(n = i(a * c + t[0]) + r), (e = `calc(100% - ${i(-1 * t[1])}${r})`);
						break;
					case 'top left':
						(n = i(t[0]) + r), (e = i(a * c + t[1]) + r);
				}
				return [n, e];
			}),
			k = b.map((t) => `        ${t[0]} ${t[1]},\n`);
		return (
			(k = k.filter((t, n) => k.indexOf(t) === n)),
			k.reduce((t, n) => t + n, '')
		);
	}
	return function (t: {
		radius: number;
		unit: 'px';
		precise: number;
		format: 'minify';
	}) {
		const n =
			'relative' ===
			(t = Object.assign(
				{
					radius: 0,
					unit: 'px',
					precise: 4,
					mode: 'relative',
					format: 'prettier',
				},
				t
			)).mode
				? 1.65
				: 1.1878944768102924;
		let r: string, o: string;
		let cssPolygonRule = `polygon(${(function (t, n, e = 4) {
			(r = `${i(a * t)}${n} 0${n},\n`);
			(o = c(1, 1, t, n, e, 'top right')),
				(r += o),
				(o = c(1, -1, t, n, e, 'bottom right')),
				(r += o),
				(o = c(-1, -1, t, n, e, 'bottom left')),
				(r += o),
				(o = c(-1, 1, t, n, e, 'top left')),
				(r += o);
			const l = `calc(100% - 0${n})`;
			return (r = r.split(l).join('100%')), (r = r.replace(/,\n$/, '')), r;
		})(t.radius * n, t.unit, t.precise)})`;
		'minify' === t.format && (cssPolygonRule = cssPolygonRule.replace(/\n\s\s\s\s\s\s\s\s/g, ''));
		return cssPolygonRule
	};
})();

export default clothoidize;