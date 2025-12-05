func RCTLogError(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    DispatchQueue.main.async {
        RCTSwiftLog.error(message, file: file, line: Int(line))
    }
}

func RCTLogWarn(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    DispatchQueue.main.async {
        RCTSwiftLog.warn(message, file: file, line: Int(line))
    }
}

func RCTLogInfo(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    DispatchQueue.main.async {
        RCTSwiftLog.info(message, file: file, line: Int(line))
    }
}

func RCTLog(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    DispatchQueue.main.async {
        RCTSwiftLog.log(message, file: file, line: Int(line))
    }
}

func RCTLogTrace(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    DispatchQueue.main.async {
        RCTSwiftLog.trace(message, file: file, line: Int(line))
    }
}
