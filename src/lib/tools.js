const capitalize = (word, firstLetter = true) => {
  return (firstLetter ? word.charAt(0).toUpperCase() : word.charAt(0)) + word.slice(1).replace(/(\_\w)/g, match => match[1].toUpperCase())
}

export default {
  capitalize
}
