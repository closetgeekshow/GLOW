/**
 * GLOW.Matrix4. Based upon THREE.Matrix4 by:
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

GLOW.Matrix4 = (function() {

	"use strict"; "use restrict"

    //constructor
    function matrix4() {
    	this.value = new Float32Array( 16 );
    	this.rotation = new GLOW.Vector3();
    	this.position = new GLOW.Vector3();
    	this.columnX  = new GLOW.Vector3();
    	this.columnY  = new GLOW.Vector3();
    	this.columnZ  = new GLOW.Vector3();
    	this.identity();
    }


    // methods
    matrix4.prototype.set = function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {
    	this.value[ 0 ] = m11; this.value[ 4 ] = m12; this.value[ 8 ] = m13; this.value[ 12 ] = m14;
    	this.value[ 1 ] = m21; this.value[ 5 ] = m22; this.value[ 9 ] = m23; this.value[ 13 ] = m24;
    	this.value[ 2 ] = m31; this.value[ 6 ] = m32; this.value[ 10 ] = m33; this.value[ 14 ] = m34;
    	this.value[ 3 ] = m41; this.value[ 7 ] = m42; this.value[ 11 ] = m43; this.value[ 15 ] = m44;
    	return this;
    }

    matrix4.prototype.identity = function () {
    	this.set( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 );
    	return this;
    }

    matrix4.prototype.copy = function( a ) {
    	a = a.value;
    	this.set(
    		a[ 0 ], a[ 4 ], a[ 8  ], a[ 12 ],
    		a[ 1 ], a[ 5 ], a[ 9  ], a[ 13 ],
    		a[ 2 ], a[ 6 ], a[ 10 ], a[ 14 ],
    		a[ 3 ], a[ 7 ], a[ 11 ], a[ 15 ]
    	);
    	return this;
    }

    matrix4.prototype.lookAt = function( focus, up ) {
    	var x = GLOW.Matrix4.tempVector3A, 
    	    y = GLOW.Matrix4.tempVector3B, 
    	    z = GLOW.Matrix4.tempVector3C;
    	var eye = this.getPosition();	

    	eye.value[ 0 ] = this.value[ 12 ];
    	eye.value[ 1 ] = this.value[ 13 ];
    	eye.value[ 2 ] = this.value[ 14 ];

    	z.sub( eye, focus ).normalize();

    	if( z.length() === 0 ) {
    		z.value[ 3 ] = 1;
    	}

    	x.cross( up, z ).normalize();

    	if( x.length() === 0 ) {
    		z.value[ 0 ] += 0.0001;
    		x.cross( up, z ).normalize();
    	}

    	y.cross( z, x ).normalize();

    	x = x.value;
    	y = y.value;
    	z = z.value;

    	this.value[ 0 ] = x[ 0 ]; this.value[ 4 ] = y[ 0 ]; this.value[  8 ] = z[ 0 ];
    	this.value[ 1 ] = x[ 1 ]; this.value[ 5 ] = y[ 1 ]; this.value[  9 ] = z[ 1 ];
    	this.value[ 2 ] = x[ 2 ]; this.value[ 6 ] = y[ 2 ]; this.value[ 10 ] = z[ 2 ];

    	return this;
    }

    matrix4.prototype.multiplyVector3 = function ( v ) {
  	    var vx = v.value[ 0 ], vy = v.value[ 1 ], vz = v.value[ 2 ],
    	d = 1 / ( this.value[ 3 ] * vx + this.value[ 7 ] * vy + this.value[ 11 ] * vz + this.value[ 15 ] );

    	v.value[ 0 ] = ( this.value[ 0 ] * vx + this.value[ 4 ] * vy + this.value[ 8 ] * vz + this.value[ 12 ] ) * d;
    	v.value[ 1 ] = ( this.value[ 1 ] * vx + this.value[ 5 ] * vy + this.value[ 9 ] * vz + this.value[ 13 ] ) * d;
    	v.value[ 2 ] = ( this.value[ 2 ] * vx + this.value[ 6 ] * vy + this.value[ 10 ] * vz + this.value[ 14 ] ) * d;
    	return v;
    }

    matrix4.prototype.multiplyVector4 = function ( v ) {
    	var vx = v.value[ 0 ], vy = v.value[ 1 ], vz = v.value[ 2 ], vw = v.value[ 3 ];
    	v.value[ 0 ] = this.value[ 0 ] * vx + this.value[ 4 ] * vy + this.value[ 8 ] * vz + this.value[ 12 ] * vw;
    	v.value[ 1 ] = this.value[ 1 ] * vx + this.value[ 5 ] * vy + this.value[ 9 ] * vz + this.value[ 13 ] * vw;
    	v.value[ 2 ] = this.value[ 2 ] * vx + this.value[ 6 ] * vy + this.value[ 10 ] * vz + this.value[ 14 ] * vw;
    	v.value[ 3 ] = this.value[ 3 ] * vx + this.value[ 7 ] * vy + this.value[ 11 ] * vz + this.value[ 15 ] * vw;

    	return v;
    }

    matrix4.prototype.rotateAxis = function ( v ) {
    	var vx = v.value[ 0 ], vy = v.value[ 1 ], vz = v.value[ 2 ];
    	v.value[ 0 ] = vx * this.value[ 0 ] + vy * this.value[ 4 ] + vz * this.value[ 8 ];
    	v.value[ 1 ] = vx * this.value[ 1 ] + vy * this.value[ 5 ] + vz * this.value[ 9 ];
    	v.value[ 2 ] = vx * this.value[ 2 ] + vy * this.value[ 6 ] + vz * this.value[ 10 ];
    	v.normalize();
    	return v;
    }

    matrix4.prototype.crossVector = function ( a ) {
    	var v = GLOW.Vector4();
    	var ax = a.value[ 0 ], ay = a.value[ 1 ], az = a.value[ 2 ], aw = a.value[ 3 ];
    	v.value[ 0 ] = this.value[ 0 ] * ax + this.value[ 4 ] * ay + this.value[ 8 ] * az + this.value[ 12 ] * aw;
    	v.value[ 1 ] = this.value[ 1 ] * ax + this.value[ 5 ] * ay + this.value[ 9 ] * az + this.value[ 13 ] * aw;
    	v.value[ 2 ] = this.value[ 2 ] * ax + this.value[ 6 ] * ay + this.value[ 10 ] * az + this.value[ 14 ] * aw;
    	v.value[ 3 ] = ( aw ) ? this.value[ 3 ] * ax + this.value[ 7 ] * ay + this.value[ 11 ] * az + this.value[ 15 ] * aw : 1;
    	return v;
    }

    matrix4.prototype.multiply = function ( a, b ) {
    	a = a.value;
    	b = b.value;
    	var a11 = a[ 0 ], a12 = a[ 4 ], a13 = a[ 8 ], a14 = a[ 12 ],
    	    a21 = a[ 1 ], a22 = a[ 5 ], a23 = a[ 9 ], a24 = a[ 13 ],
    	    a31 = a[ 2 ], a32 = a[ 6 ], a33 = a[ 10 ], a34 = a[ 14 ],
    	    a41 = a[ 3 ], a42 = a[ 7 ], a43 = a[ 11 ], a44 = a[ 15 ],
    	b11 = b[ 0 ], b12 = b[ 4 ], b13 = b[ 8 ], b14 = b[ 12 ],
    	b21 = b[ 1 ], b22 = b[ 5 ], b23 = b[ 9 ], b24 = b[ 13 ],
    	b31 = b[ 2 ], b32 = b[ 6 ], b33 = b[ 10 ], b34 = b[ 14 ],
    	b41 = b[ 3 ], b42 = b[ 7 ], b43 = b[ 11 ], b44 = b[ 15 ];
    	this.value[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
    	this.value[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32;
    	this.value[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33;
    	this.value[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    	this.value[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
    	this.value[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32;
    	this.value[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33;
    	this.value[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    	this.value[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
    	this.value[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32;
    	this.value[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33;
    	this.value[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    	this.value[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31;
    	this.value[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32;
    	this.value[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33;
    	this.value[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44;
    	return this;
    }

    matrix4.prototype.multiplySelf = function ( a ) {
    	this.multiply( m, a );
    	return this;
    }

    matrix4.prototype.multiplyScalar = function ( s ) {
    	this.value[ 0 ] *= s; this.value[ 4 ] *= s; this.value[ 8 ] *= s; this.value[ 12 ] *= s;
    	this.value[ 1 ] *= s; this.value[ 5 ] *= s; this.value[ 9 ] *= s; this.value[ 13 ] *= s;
    	this.value[ 2 ] *= s; this.value[ 6 ] *= s; this.value[ 10 ] *= s; this.value[ 14 ] *= s;
    	this.value[ 3 ] *= s; this.value[ 7 ] *= s; this.value[ 11 ] *= s; this.value[ 15 ] *= s;
    	return this;
    }

    matrix4.prototype.determinant = function () {
    	var n11 = this.value[ 0 ], n12 = this.value[ 4 ], n13 = this.value[ 8 ], n14 = this.value[ 12 ],
    	n21 = this.value[ 1 ], n22 = this.value[ 5 ], n23 = this.value[ 9 ], n24 = this.value[ 13 ],
    	n31 = this.value[ 2 ], n32 = this.value[ 6 ], n33 = this.value[ 10 ], n34 = this.value[ 14 ],
    	n41 = this.value[ 3 ], n42 = this.value[ 7 ], n43 = this.value[ 11 ], n44 = this.value[ 15 ];
    	return (
    		n14 * n23 * n32 * n41-
    		n13 * n24 * n32 * n41-
    		n14 * n22 * n33 * n41+
    		n12 * n24 * n33 * n41+
    		n13 * n22 * n34 * n41-
    		n12 * n23 * n34 * n41-
    		n14 * n23 * n31 * n42+
    		n13 * n24 * n31 * n42+
    		n14 * n21 * n33 * n42-
    		n11 * n24 * n33 * n42-
    		n13 * n21 * n34 * n42+
    		n11 * n23 * n34 * n42+
    		n14 * n22 * n31 * n43-
    		n12 * n24 * n31 * n43-
    		n14 * n21 * n32 * n43+
    		n11 * n24 * n32 * n43+
    		n12 * n21 * n34 * n43-
    		n11 * n22 * n34 * n43-
    		n13 * n22 * n31 * n44+
    		n12 * n23 * n31 * n44+
    		n13 * n21 * n32 * n44-
    		n11 * n23 * n32 * n44-
    		n12 * n21 * n33 * n44+
    		n11 * n22 * n33 * n44
    	);
    }

    matrix4.prototype.transpose = function () {
    	var tmp;
    	tmp = this.value[ 1 ]; this.value[ 1 ] = this.value[ 4 ]; this.value[ 4 ] = tmp;
    	tmp = this.value[ 2 ]; this.value[ 2 ] = this.value[ 8 ]; this.value[ 8 ] = tmp;
    	tmp = this.value[ 6 ]; this.value[ 6 ] = this.value[ 9 ]; this.value[ 9 ] = tmp;
    	tmp = this.value[ 3 ]; this.value[ 3 ] = this.value[ 12 ]; this.value[ 12 ] = tmp;
    	tmp = this.value[ 7 ]; this.value[ 7 ] = this.value[ 13 ]; this.value[ 13 ] = tmp;
    	tmp = this.value[ 11 ]; this.value[ 11 ] = this.value[ 14 ]; this.value[ 11 ] = tmp;
    	return this;
    }

    matrix4.prototype.clone = function () {
    	var clone = new GLOW.Matrix4();
    	clone.value = new Float32Array( this.value );
    	return clone;
    }


    matrix4.prototype.setPosition = function( x, y, z ) {
    	this.value[ 12 ] = x;
    	this.value[ 13 ] = y;
    	this.value[ 14 ] = z;
    	return this;
    }

    matrix4.prototype.addPosition = function( x, y, z ) {
    	this.value[ 12 ] += x;
    	this.value[ 13 ] += y;
    	this.value[ 14 ] += z;
    }

    matrix4.prototype.setRotation = function( x, y, z ) {
    	this.rotation.set( x, y, z );
    	var a = Math.cos( x ), b = Math.sin( x ),
    	    c = Math.cos( y ), d = Math.sin( y ),
    	    e = Math.cos( z ), f = Math.sin( z ),
    	    ad = a * d, bd = b * d;
    	this.value[ 0 ] = c * e;
    	this.value[ 4 ] = - c * f;
    	this.value[ 8 ] = d;
    	this.value[ 1 ] = bd * e + a * f;
    	this.value[ 5 ] = - bd * f + a * e;
    	this.value[ 9 ] = - b * c;
    	this.value[ 2 ] = - ad * e + b * f;
    	this.value[ 6 ] = ad * f + b * e;
    	this.value[ 10 ] = a * c;
    	return this;
    }

    matrix4.prototype.addRotation = function( x, y, z ) {
    	this.rotation.value[ 0 ] += x;
    	this.rotation.value[ 1 ] += y;
    	this.rotation.value[ 2 ] += z;
    	this.setRotation( this.rotation.value[ 0 ], this.rotation.value[ 1 ], this.rotation.value[ 2 ] );
    }

    matrix4.prototype.getPosition = function() {
    	this.position.set( this.value[ 12 ], this.value[ 13 ], this.value[ 14 ] );
    	return this.position;
    }

    matrix4.prototype.getColumnX = function() {
    	this.columnX.set( this.value[ 0 ], this.value[ 1 ], this.value[ 2 ] );
    	return this.columnX;
    }

    matrix4.prototype.getColumnY = function() {
    	this.columnY.set( this.value[ 4 ], this.value[ 5 ], this.value[ 6 ] );
    	return this.columnY;
    }

    matrix4.prototype.getColumnZ = function() {
    	this.columnZ.set( this.value[ 8 ], this.value[ 9 ], this.value[ 10 ] );
    	return this.columnZ;
    }

    matrix4.prototype.scale = function( v, y, z ) {
    	var x;
    	if( y !== undefined && z !== undefined ) {
    		x = v;
    	} else {
    		x = v.value[ 0 ];
    		y = v.value[ 1 ];
    		z = v.value[ 2 ];
    	}

    	this.value[ 0 ] *= x; this.value[ 4 ] *= y; this.value[ 8 ] *= z;
    	this.value[ 1 ] *= x; this.value[ 5 ] *= y; this.value[ 9 ] *= z;
    	this.value[ 2 ] *= x; this.value[ 6 ] *= y; this.value[ 10 ] *= z;
    	this.value[ 3 ] *= x; this.value[ 7 ] *= y; this.value[ 11 ] *= z;
    	return this;
    }

    return matrix4;
})();





/*
* Helpers
*/

GLOW.Matrix4.makeInverse = function ( m1, m2 ) {

	// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm

	if( m2 === undefined ) m2 = new GLOW.Matrix4();

	var m1v = m1.value;
	var m2v = m2.value;

	var n11 = m1v[ 0 ], n12 = m1v[ 4 ], n13 = m1v[ 8  ], n14 = m1v[ 12 ],
	    n21 = m1v[ 1 ], n22 = m1v[ 5 ], n23 = m1v[ 9  ], n24 = m1v[ 13 ],
	    n31 = m1v[ 2 ], n32 = m1v[ 6 ], n33 = m1v[ 10 ], n34 = m1v[ 14 ],
	    n41 = m1v[ 3 ], n42 = m1v[ 7 ], n43 = m1v[ 11 ], n44 = m1v[ 15 ];

	m2v[ 0  ] = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
	m2v[ 1  ] = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
	m2v[ 2  ] = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
	m2v[ 3  ] = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
	m2v[ 4  ] = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
	m2v[ 5  ] = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
	m2v[ 6  ] = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
	m2v[ 7  ] = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
	m2v[ 8  ] = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
	m2v[ 9  ] = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
	m2v[ 10 ] = n13*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
	m2v[ 11 ] = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
	m2v[ 12 ] = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
	m2v[ 13 ] = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
	m2v[ 14 ] = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
	m2v[ 15 ] = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;
	
	m2.multiplyScalar( 1 / m1.determinant());

	return m2;

};

/*THREE.Matrix4.makeInvert3x3 = function ( m1 ) {

	// input:  THREE.Matrix4, output: THREE.Matrix3
	// ( based on http://code.google.com/p/webgl-mjs/ )

	var m33 = m1.m33, m33m = m33.m,
	a11 =   m1.n33 * m1.n22 - m1.n32 * m1.n23,
	a21 = - m1.n33 * m1.n21 + m1.n31 * m1.n23,
	a31 =   m1.n32 * m1.n21 - m1.n31 * m1.n22,
	a12 = - m1.n33 * m1.n12 + m1.n32 * m1.n13,
	a22 =   m1.n33 * m1.n11 - m1.n31 * m1.n13,
	a32 = - m1.n32 * m1.n11 + m1.n31 * m1.n12,
	a13 =   m1.n23 * m1.n12 - m1.n22 * m1.n13,
	a23 = - m1.n23 * m1.n11 + m1.n21 * m1.n13,
	a33 =   m1.n22 * m1.n11 - m1.n21 * m1.n12,

	det = m1.n11 * a11 + m1.n21 * a12 + m1.n31 * a13,

	idet;

	// no inverse
	if (det == 0) {
		throw "matrix not invertible";
	}
	
	idet = 1.0 / det;

	m33this.value[ 0 ] = idet * a11; m33this.value[ 1 ] = idet * a21; m33this.value[ 2 ] = idet * a31;
	m33this.value[ 3 ] = idet * a12; m33this.value[ 4 ] = idet * a22; m33this.value[ 5 ] = idet * a32;
	m33this.value[ 6 ] = idet * a13; m33this.value[ 7 ] = idet * a23; m33this.value[ 8 ] = idet * a33;

	return m33;

}
*/

GLOW.Matrix4.makeFrustum = function ( left, right, bottom, top, near, far ) {

	var m, mv, x, y, a, b, c, d;

	m = new GLOW.Matrix4();
	x = 2 * near / ( right - left );
	y = 2 * near / ( top - bottom );
	a = ( right + left ) / ( right - left );
	b = ( top + bottom ) / ( top - bottom );
	c = - ( far + near ) / ( far - near );
	d = - 2 * far * near / ( far - near );

	mv = m.value;
	mv[ 0 ] = x;  mv[ 4 ] = 0;  mv[ 8  ] = a;   mv[ 12 ] = 0;
	mv[ 1 ] = 0;  mv[ 5 ] = y;  mv[ 9  ] = b;   mv[ 13 ] = 0;
	mv[ 2 ] = 0;  mv[ 6 ] = 0;  mv[ 10 ] = c;   mv[ 14 ] = d;
	mv[ 3 ] = 0;  mv[ 7 ] = 0;  mv[ 11 ] = - 1; mv[ 15 ] = 0;

	return m;

};

GLOW.Matrix4.makeProjection = function ( fov, aspect, near, far ) {

	var ymax, ymin, xmin, xmax;

	ymax = near * Math.tan( fov * Math.PI / 360 );
	ymin = - ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;

	return GLOW.Matrix4.makeFrustum( xmin, xmax, ymin, ymax, near, far );

};

GLOW.Matrix4.makeOrtho = function( left, right, top, bottom, near, far ) {

	var m, mv, x, y, z, w, h, p;

	m = new GLOW.Matrix4();
	w = right - left;
	h = top - bottom;
	p = far - near;
	x = ( right + left ) / w;
	y = ( top + bottom ) / h;
	z = ( far + near ) / p;

	mv = m.value;

	mv[ 0 ] = 2 / w; mv[ 4 ] = 0;     mv[ 8  ] = 0;      mv[ 12 ] = -x;
	mv[ 1 ] = 0;     mv[ 5 ] = 2 / h; mv[ 9  ] = 0;      mv[ 13 ] = -y;
	mv[ 2 ] = 0;     mv[ 6 ] = 0;     mv[ 10 ] = -2 / p; mv[ 14 ] = -z;
	mv[ 3 ] = 0;     mv[ 7 ] = 0;     mv[ 11 ] = 0;      mv[ 15 ] = 1;

	return m;

};


GLOW.Matrix4.tempVector3A = new GLOW.Vector3();
GLOW.Matrix4.tempVector3B = new GLOW.Vector3();
GLOW.Matrix4.tempVector3C = new GLOW.Vector3();
GLOW.Matrix4.tempVector3D = new GLOW.Vector3();
