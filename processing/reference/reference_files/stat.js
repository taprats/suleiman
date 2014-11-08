(function() {
  var data, getAttrib, getContext, getContextByName, getExtensions, getParams, getShaderPrecisions, getWebglInfo, isPresent, paramNames, request, vendorName, vendors;

  vendors = [null, 'webkit', 'moz', 'ms', 'o'];

  vendorName = function(name, vendor) {
    if ((vendor != null) && vendor.length > 0) {
      return vendor + name[0].toUpperCase() + name.substr(1);
    } else {
      return name;
    }
  };

  getAttrib = function(obj, name) {
    var prop, vendor, _i, _len;
    if (obj != null) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        vendor = vendors[_i];
        prop = vendorName(name, vendor);
        if (obj[prop] != null) {
          return obj[prop];
        }
      }
    }
  };

  isPresent = function(obj, name) {
    return getAttrib(obj, name) != null;
  };

  getShaderPrecisions = function(ctx) {
    var getFormat, getStageFormat;
    getFormat = function(stage, type) {
      var format;
      format = ctx.getShaderPrecisionFormat(stage, type);
      return {
        rangeMin: format.rangeMin,
        rangeMax: format.rangeMax,
        precision: format.precision
      };
    };
    getStageFormat = function(stage) {
      return {
        LOW_FLOAT: getFormat(stage, ctx.LOW_FLOAT),
        MEDIUM_FLOAT: getFormat(stage, ctx.MEDIUM_FLOAT),
        HIGH_FLOAT: getFormat(stage, ctx.HIGH_FLOAT),
        LOW_INT: getFormat(stage, ctx.LOW_INT),
        MEDIUM_INT: getFormat(stage, ctx.MEDIUM_INT),
        HIGH_INT: getFormat(stage, ctx.HIGH_INT)
      };
    };
    return {
      VERTEX_SHADER: getStageFormat(ctx.VERTEX_SHADER),
      FRAGMENT_SHADER: getStageFormat(ctx.FRAGMENT_SHADER)
    };
  };

  getParams = function(ctx, names) {
    var enumValue, name, param, paramItem, params, _i, _len;
    params = {};
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      enumValue = ctx[name];
      if (enumValue != null) {
        param = ctx.getParameter(enumValue);
        if (param instanceof Float32Array || param instanceof Int32Array) {
          params[name] = (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = param.length; _j < _len1; _j++) {
              paramItem = param[_j];
              _results.push(paramItem);
            }
            return _results;
          })();
        } else {
          params[name] = param;
        }
      }
    }
    return params;
  };

  getExtensions = function(ctx) {
    var capabilities, ext, extname, supported, _i, _len;
    supported = ctx.getSupportedExtensions();
    capabilities = {};
    for (_i = 0, _len = supported.length; _i < _len; _i++) {
      extname = supported[_i];
      if (extname.match('texture_filter_anisotropic')) {
        ext = ctx.getExtension(extname);
        capabilities[extname] = {
          MAX_TEXTURE_MAX_ANISOTROPY_EXT: ctx.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
        };
      } else if (extname.match('OES_standard_derivatives')) {
        ext = ctx.getExtension(extname);
        capabilities[extname] = {
          FRAGMENT_SHADER_DERIVATIVE_HINT_OES: ctx.getParameter(ext.FRAGMENT_SHADER_DERIVATIVE_HINT_OES)
        };
      } else if (extname.match('WEBGL_draw_buffers')) {
        ext = ctx.getExtension(extname);
        capabilities[extname] = {
          MAX_COLOR_ATTACHMENTS_WEBGL: ctx.getParameter(ext.MAX_COLOR_ATTACHMENTS_WEBGL),
          MAX_DRAW_BUFFERS_WEBGL: ctx.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL)
        };
      } else if (extname.match('WEBGL_debug_renderer_info')) {
        ext = ctx.getExtension(extname);
        if (ext != null) {
          capabilities[extname] = {
            UNMASKED_VENDOR_WEBGL: ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL),
            UNMASKED_RENDERER_WEBGL: ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL)
          };
        }
      }
    }
    return {
      supported: supported,
      capabilities: capabilities
    };
  };

  getContext = function(info, canvas, name) {
    var ctx;
    try {
      ctx = canvas.getContext(name, {
        stencil: true
      });
      if (ctx != null) {
        info.name = name;
        info.supported = true;
      }
      return ctx;
    } catch (_error) {
      return null;
    }
  };

  getContextByName = function(info, canvas, name) {
    var ctx;
    ctx = getContext(info, canvas, name);
    if (ctx == null) {
      ctx = getContext(info, canvas, 'experimental-' + name);
    }
    return ctx;
  };

  getWebglInfo = function(name, paramNames) {
    var canvas, ctx, info;
    canvas = document.createElement('canvas');
    info = {
      supported: false
    };
    if ((canvas != null) && (canvas.getContext != null)) {
      ctx = getContextByName(info, canvas, name);
      if (ctx != null) {
        ctx.enable(ctx.SAMPLE_ALPHA_TO_COVERAGE);
        ctx.enable(ctx.SAMPLE_COVERAGE);
        info.params = getParams(ctx, paramNames);
        info.extensions = getExtensions(ctx);
        if (ctx.getShaderPrecisionFormat != null) {
          info.shaderPrecision = getShaderPrecisions(ctx);
        } else {
          info.shaderPrecision = null;
        }
      }
    }
    return info;
  };

  paramNames = {};

  paramNames.webgl = 'ALIASED_LINE_WIDTH_RANGE\nALIASED_POINT_SIZE_RANGE\nALPHA_BITS\nBLUE_BITS\nDEPTH_BITS\nGREEN_BITS\nMAX_COMBINED_TEXTURE_IMAGE_UNITS\nMAX_CUBE_MAP_TEXTURE_SIZE\nMAX_FRAGMENT_UNIFORM_VECTORS\nMAX_RENDERBUFFER_SIZE\nMAX_TEXTURE_IMAGE_UNITS\nMAX_TEXTURE_SIZE\nMAX_VARYING_VECTORS\nMAX_VERTEX_ATTRIBS\nMAX_VERTEX_TEXTURE_IMAGE_UNITS\nMAX_VERTEX_UNIFORM_VECTORS\nMAX_VIEWPORT_DIMS\nRED_BITS\nSAMPLE_COVERAGE_VALUE\nSAMPLES\nSTENCIL_BITS\nSUBPIXEL_BITS\nVENDOR\nRENDERER\nVERSION\nSHADING_LANGUAGE_VERSION\nCOMPRESSED_TEXTURE_FORMATS\nSAMPLE_BUFFERS'.split('\n');

  paramNames.webgl2new = 'MAX_3D_TEXTURE_SIZE\nMAX_ARRAY_TEXTURE_LAYERS\nMAX_COLOR_ATTACHMENTS\nMAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS\nMAX_COMBINED_UNIFORM_BLOCKS\nMAX_COMBINED_VERTEX_UNIFORM_COMPONENTS\nMAX_DRAW_BUFFERS\nMAX_ELEMENT_INDEX\nMAX_ELEMENTS_INDICES\nMAX_ELEMENTS_VERTICES\nMAX_FRAGMENT_INPUT_COMPONENTS\nMAX_FRAGMENT_UNIFORM_BLOCKS\nMAX_FRAGMENT_UNIFORM_COMPONENTS\nMAX_PROGRAM_TEXEL_OFFSET\nMAX_SAMPLES\nMAX_SERVER_WAIT_TIMEOUT\nMAX_TEXTURE_LOD_BIAS\nMAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS\nMAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS\nMAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS\nMAX_UNIFORM_BLOCK_SIZE\nMAX_UNIFORM_BUFFER_BINDINGS\nMAX_VARYING_COMPONENTS\nMAX_VERTEX_OUTPUT_COMPONENTS\nMAX_VERTEX_UNIFORM_BLOCKS\nMAX_VERTEX_UNIFORM_COMPONENTS\nMIN_PROGRAM_TEXEL_OFFSET'.split('\n');

  paramNames.webgl2 = paramNames.webgl.concat(paramNames.webgl2new);

  data = {
    statVersion: '2.0',
    webgl: getWebglInfo('webgl', paramNames.webgl),
    webgl2: getWebglInfo('webgl2', paramNames.webgl2),
    requestAnimationFrame: isPresent(window, 'requestAnimationFrame'),
    fullscreen: isPresent(document, 'cancelFullScreen'),
    pointerlock: isPresent(document.body, 'requestPointerLock'),
    gamepads: isPresent(navigator, 'getGamepads'),
    webAudioData: isPresent(window, 'AudioContext'),
    websocket: isPresent(window, 'WebSocket'),
    webworker: isPresent(window, 'Worker'),
    webRTC: {
      support: isPresent(window, 'RTCPeerConnection'),
      data: isPresent(window, 'RTCDataChannelEvent')
    },
    page: {
      referrer: document.referrer,
      location: document.location.href,
      navigator: {
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        platform: navigator.platform,
        vendor: navigator.vendor
      }
    }
  };

  request = new XMLHttpRequest();

  request.open('POST', "//cdn.webglstats.com", true);

  request.setRequestHeader('Content-Type', 'application/json');

  request.send(JSON.stringify(data));

}).call(this);
