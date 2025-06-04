class Fraction {
    constructor(numerator, denominator = 1n) {
        this.numerator = BigInt(numerator);
        this.denominator = BigInt(denominator);
        this.reduce();
    }

    reduce() {
        const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));
        let g = gcd(this.numerator < 0n ? -this.numerator : this.numerator, this.denominator);
        this.numerator /= g;
        this.denominator /= g;
        if (this.denominator < 0n) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }

    add(other) {
        return new Fraction(
            this.numerator * other.denominator + other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    sub(other) {
        return new Fraction(
            this.numerator * other.denominator - other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    mul(other) {
        return new Fraction(
            this.numerator * other.numerator,
            this.denominator * other.denominator
        );
    }

    div(other) {
        if (other.numerator === 0n) throw new Error("Divisão por zero.");
        return new Fraction(
            this.numerator * other.denominator,
            this.denominator * other.numerator
        );
    }

    equals(other) {
        return this.numerator === other.numerator && this.denominator === other.denominator;
    }

    isZero() {
        return this.numerator === 0n;
    }

    toBigInt() {
        // Trunca a parte decimal
        return this.numerator / this.denominator;
    }

    toNumber() {
        return Number(this.numerator) / Number(this.denominator);
    }

    static fromNumber(num, precision = 1e9) {
        // Converte um n?mero JS float em Fraction aproximado
        let denominator = BigInt(precision);
        let numerator = BigInt(Math.round(num * precision));
        return new Fraction(numerator, denominator);
    }
}
