class Response {
  constructor(data = null, message = null) {
    this.data = data;
    this.message = message;
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message || "Success ",
    });
  }

  created(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message || "Created ",
    });
  }

  badRequest(res) {
    return res.status(400).json({
      success: false,
      data: this.data,
      message: this.message || "Bad Request ",
    });
  }

  error404(res) {
    return res.status(404).json({
      success: false,
      data: this.data,
      message: this.message || "Not Found ",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message || "Internal Server Error ",
    });
  }

  error401(res) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message || "Unauthorized ",
    });
  }

  error429(res) {
    // Too Many Requests and DDoS Protection
    return res.status(429).json({
      success: false,
      data: this.data,
      message: this.message || "Too Many Requests ",
    });
  }
}

module.exports = Response;
