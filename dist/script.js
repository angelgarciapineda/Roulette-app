/* var data = [
  //{ id: '', color: '#3f297e', text: 'ALL IN', ikon: 'invert_colors' },

  //ALDRO AQUI PUEDES MODIFICAR LOS PREMIOS. En el apartado text colocar el premio de cada sección. Si necesitas modificar la velocidad hay un atributo llamado duration más adelante que puedes modificar también.

  //Modificar Premio Tequila QP
  {
    id: "",
    type: "allin",
    color: "#1b87e6",
    text: "0.001%",
    ikon: "",
    val: 0.001,
  },
  // Modificar Premio Airpods
  { id: "", type: "quiz", color: "#1b87e6", text: "0.03%", val: 0.03 },
  // Modificar Premio Tarjeta
  { id: "", type: "quiz", color: "#1b3380", text: "0.05%", val: 0.05 },
  // Modificar Premio Beats - 2
  { id: "", color: "#1b87e6", text: "0.1%", ikon: "", val: 0.01 },
  // Modificar Premio Airpods - 2
  { id: "", color: "#1b3380", text: "0.125%", val: 0.125 },
  // Modificar Premio Tequila QP - 2
  { id: "", color: "#1b87e6", text: "0.25%", val: 0.25 },
  // Modificar Premio Dashboard
  {
    id: "",
    type: "time",
    color: "#1b3380",
    text: "0.5%",
    ikon: "",
    val: 0.5,
  },
  // Modificar premio Netflix
  { id: "", type: "question", color: "#1b87e6", text: "1%", val: 1 },
  // Modificar premio Cine QP
  { id: "", color: "#1b3380", text: "1.5%", val: 1.5 },
  // Modificar premio Airpods - 2
  { id: "", color: "#1b87e6", text: "2%", val: 2 },
  // Modificar premio Jugar de nuevo
  {
    id: "",
    type: "replay",
    color: "#1b3380",
    text: "Jugar de nuevo",
    ikon: "replay",
  },
]; */
const ruleta = {
  porcentaje: 10,
  clientes: 30,
};
var grado;
/* Divisiones de la ruleta */
const secciones = 4;
/* Descuentos calculados a partir del monto ingresado
y del numero de divisiones de la ruleta que serán al final */
var descuentosdisponibles = [];

var RouletteWheel = function (el, items) {
  this.$el = $(el);
  this.items = items || [];
  this._bis = false;
  this._angle = 0;
  this._index = 0;
  this.options = {
    angleOffset: -90,
  };
};

_.extend(RouletteWheel.prototype, Backbone.Events);

var monto;

RouletteWheel.prototype.spin = function (_index) {
  var count = this.items.length;
  var delta = 360 / count;
  var index = !isNaN(parseInt(_index))
    ? parseInt(_index)
    : parseInt(Math.random() * count);

  var a = index * delta + (this._bis ? 1440 : -1440);

  //a+=this.options.angleOffset;

  this._bis = !this._bis;
  this._angle = a;
  this._index = index;

  var $spinner = $(this.$el.find(".spinner"));

  var _onAnimationBegin = function () {
    this.$el.addClass("busy");
    this.trigger("spin:start", this);
  };

  spinner = new RouletteWheel($(".roulette"), descuentosdisponibles);
  var _onAnimationComplete = function () {
    this.$el.removeClass("busy");
    this.trigger("spin:end", this);
  };
  //var monto = document.getElementById("mount").value;

  $spinner.velocity("stop").velocity(
    {
      rotateZ: a + "deg",
    },
    {
      //easing: [20, 7],
      //easing: [200, 20],
      easing: "easeOutQuint",
      duration: 800,
      begin: $.proxy(_onAnimationBegin, this),
      complete: $.proxy(_onAnimationComplete, this),
    }
  );
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

RouletteWheel.prototype.render = function () {
  var $spinner = $(this.$el.find(".spinner"));
  var D = this.$el.width();
  var R = D * 0.5;

  var count = this.items.length;
  var delta = 360 / count;

  for (var i = 0; i < count; i++) {
    var item = this.items[i];

    var color = "#1B87E6";
    var text = item;
    var ikon = item.ikon;

    var html = [];
    html.push('<div class="item" ');
    html.push('data-index="' + i + '" ');
    //html.push('data-type="' + item.type + '" ');
    html.push(">");
    html.push('<span class="label">');
    if (ikon) html.push('<i class="material-icons">' + ikon + "</i>");
    html.push('<span class="text">' + text + "</span>");
    html.push("</span>");
    html.push("</div>");

    var $item = $(html.join(""));

    var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
    var deltaInRadians = (delta * Math.PI) / 180;
    var borderRightWidth = D / (1 / Math.tan(deltaInRadians));

    var r = delta * (count - i) + this.options.angleOffset - delta * 0.5;

    $item.css({
      borderTopWidth: borderTopWidth,
      borderRightWidth: borderRightWidth,
      transform: "scale(2) rotate(" + r + "deg)",
      borderTopColor: getRandomColor(),
    });

    var textHeight = parseInt(((1 * Math.PI * R) / count) * 0.8);
    $item.find(".label").css({
      //transform: 'translateX('+ (textHeight) +'px) translateY('+  (-1 * R) +'px) rotateZ('+ (90 + delta*.5) +'deg)',
      transform:
        "translateY(" +
        D * -0.19 +
        "px) translateX(" +
        textHeight * 1 +
        "px) rotateZ(" +
        (90 + delta * 0.31) +
        "deg)",
      height: textHeight + "px",
      lineHeight: textHeight + "px",
      textIndent: R * 0.1 + "px",
    });
    $spinner.append($item);
  }

  $spinner.css({
    fontSize: parseInt(R * 0.06) + "px",
  });

  //this.renderMarker();
};

RouletteWheel.prototype.renderMarker = function () {
  var $markers = $(this.$el.find(".markers"));
  var D = this.$el.width();
  var R = D * 0.8;

  var count = this.items.length;
  var delta = 360 / count;

  var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
  var deltaInRadians = (delta * Math.PI) / 180;
  var borderRightWidth = D / (1 / Math.tan(deltaInRadians));

  var i = 0;
  var $markerA = $('<div class="marker">');
  var $markerB = $('<div class="marker">');

  var rA = delta * (count - i - 1) - delta * 0.5 + this.options.angleOffset;
  var rB = delta * (count - i + 1) - delta * 0.5 + this.options.angleOffset;

  $markerA.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: "scale(2) rotate(" + rA + "deg)",
    borderTopColor: "#FFF",
  });
  $markerB.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: "scale(2) rotate(" + rB + "deg)",
    borderTopColor: "#FFF",
  });

  $markers.append($markerA);
  $markers.append($markerB);
};

RouletteWheel.prototype.bindEvents = function () {
  this.$el.find(".button").on("click", $.proxy(this.spin, this));
  this.$el.find(".button").prop('disabled',true);
};

var spinner;
var min;
var max;
//var monto
$(window).ready(function () {
  min = 1;
  max = 1000000;
  //16 = secciones restantes
  descuentosdisponibles.length = parseInt(secciones) + 16;
  var monto = Math.random()*(max - min) + min;
  monto = monto.toFixed(2);
  /* monto = Math.floor(Math.random() * 1700) + 300; */
  if (monto > 0 && monto < 300) {
    grado = 2.3;
  }
  if (monto >= 300 && monto < 500) {
    grado = 3.3;
  }
  if (monto >= 500 && monto < 800) {
    grado = 4.3;
  }
  if (monto >= 800 && monto < 1200) {
    grado = 5.3;
  }
  if (monto >= 1200 && monto < 1600) {
    grado = 6.3;
  }
  if (monto >= 1600 && monto < 2000) {
    grado = 7.3;
  }
  if (monto > 2000) {
    grado = 8.3;
  }
  let index;
  var formula;
  for (index = 0; index < parseInt(secciones); index++) {
    formula = 10 / grado - (ruleta.porcentaje / ruleta.clientes) * index;
    descuentosdisponibles[index] = formula.toFixed(3);
  }
  for(var i=parseInt(secciones); i < descuentosdisponibles.length; i ++){
    descuentosdisponibles[i] = descuentosdisponibles[i-2];
    
  }
  descuentosdisponibles[19] =parseInt(100);

  console.log("Monto: ", monto);
  console.log(descuentosdisponibles);
  //return descuentosdisponibles;
  spinner = new RouletteWheel($(".roulette"), descuentosdisponibles);
  spinner.render();
  spinner.bindEvents();

  spinner.on("spin:start", function (r) {
    console.log("spin start!");
  });
  spinner.on("spin:end", function (r) {
    ruleta.porcentaje = ruleta.porcentaje - spinner.items[r._index];
    console.log("spin end! -->" + r._index);
    console.log("Grado: " + grado);
    console.log("Dispo: " + ruleta.porcentaje);
    const valordescuento = (monto / 100) * spinner.items[r._index];
    const valorfinal = monto - valordescuento;
    //console.log(spinner.items[r._index].val);
    //console.log(spinner.items[r._index]);

    $("#compra").text("Compra de: $ ");
    $("#desc").text("Descuento del: ");
    $("#descapli").text("Descuento aplicado: $ ");
    $("#totalfinal").text("Total a pagar: $ ");

    $("#compra").text("Compra de: $ " + monto);
    $("#desc").text("Descuento del: " + spinner.items[r._index]);
    $("#descapli").text("Descuento aplicado: $ " + valordescuento);
    $("#totalfinal").text("Total a pagar: $ " + valorfinal);

    ruleta.clientes = ruleta.clientes - 1;
    console.log("Clientes: " + ruleta.clientes);
  });
});
