import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateBonus } from "../server/services/bonusService.js";

test("Januari menghasilkan bonus 0 (PRD 13.1)", () => {
    const { bonus, total } = calculateBonus("Januari", 3500000);
    assert.equal(bonus, 0);
    assert.equal(total, 3500000);
});

test("Februari - Desember menghasilkan bonus 5% (PRD 13.1)", () => {
    const bulan = [
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    for (const b of bulan) {
        const { bonus, total } = calculateBonus(b, 4000000);
        assert.equal(bonus, 200000, `bonus ${b}`);
        assert.equal(total, 4200000, `total ${b}`);
    }
});

test("Contoh PRD 15: Februari 4.000.000 -> bonus 200.000, total 4.200.000", () => {
    const result = calculateBonus("Februari", 4000000);
    assert.deepEqual(result, { bonus: 200000, total: 4200000 });
});

test("Total = Salary + Bonus (PRD 14)", () => {
    const salary = 7250000;
    const { bonus, total } = calculateBonus("Juli", salary);
    assert.equal(total, salary + bonus);
    assert.equal(bonus, 362500);
});

test("Interpretasi reset bonus Januari (PRD 16): Januari bonus 0, data bulan lain tidak berubah", () => {
    const desember = calculateBonus("Desember", 4000000);
    assert.equal(desember.bonus, 200000);
    assert.equal(desember.total, 4200000);

    const januari = calculateBonus("Januari", 4000000);
    assert.equal(januari.bonus, 0);
    assert.equal(januari.total, 4000000);

    assert.equal(desember.bonus, 200000);
    assert.equal(desember.total, 4200000);
});
